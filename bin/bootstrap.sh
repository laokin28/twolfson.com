#!/usr/bin/env bash
# Exit on first error
set -e

# Create a temporary folder to work in
if test -d tmp/bootstrap; then
  rm -r tmp/bootstrap;
fi
mkdir -p tmp/bootstrap

# Download front-end dependencies
# TODO: Transfer `curl`/`wget` actions to `bower` where plausible
# TODO: Document sprite sources in a README rather than via `curl's`
curl "https://rawgit.com/ded/domready/b3ba502dcd41b67fc2fcd06416b9d0be27a8dce2/ready.js" > "public/js/ready.js"
curl "https://rawgit.com/ccampbell/gator/1.2.2/gator.js" > "public/js/gator.js"
curl "https://rawgit.com/ccampbell/gator/1.2.2/plugins/gator-legacy.js" > "public/js/gator-legacy.js"
curl "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.js" > "test/test_files/jquery.js"

pushd public/css/mixins
wget "https://rawgit.com/thoughtbot/bourbon/v3.0.1/app/assets/stylesheets/addons/_prefixer.scss"
wget "https://rawgit.com/thoughtbot/bourbon/v3.0.1/app/assets/stylesheets/functions/_compact.scss"
wget "https://rawgit.com/thoughtbot/bourbon/v3.0.1/app/assets/stylesheets/css3/_box-shadow.scss"
wget "https://rawgit.com/thoughtbot/bourbon/v3.0.1/app/assets/stylesheets/css3/_linear-gradient.scss"
wget "https://rawgit.com/thoughtbot/bourbon/v3.0.1/app/assets/stylesheets/css3/_transition.scss"
popd

# Download development dependencies
# DEV: We have modified `960.gridder.js` a little it seems
# curl "https://rawgit.com/peol/960gridder/677b61a7df2e6f83b6b4437fecb027fb94359f26/releases/1.3.1/960.gridder.src.js" \
  # > "public/js/960gridder/960.gridder.js"
curl "https://rawgit.com/peol/960gridder/677b61a7df2e6f83b6b4437fecb027fb94359f26/releases/1.3.1/jquery.js" \
  > "public/js/960gridder/jquery.js"

# Download external sprites
# Bitcoin - http://bitcoin.org/en/press
# DEV: Looks like URL is no longer up
# curl "https://docs.google.com/uc?export=view&id=0BwnE6HIoU4a4bUswMm5UWS1XakU" > "public/images/support_src/bitcoin.png"
# Dogecoin - http://imgur.com/a/CKqPP
curl "http://i.imgur.com/K2LYlv4.png" > "public/images/support_src/dogecoin.png"
# Gratipay - Google image search
# DEV: Looks like URL is no longer up
# curl "http://s3.amazonaws.com/catapultpgh-madeinpgh/app/public/system/logos/7/medium/gratipay-logo-256.png?1367418240" \
#   > "public/images/support_src/gratipay.png"

# Download, unzip, and install inuit.css
pushd tmp/bootstrap
wget "https://github.com/csswizardry/inuit.css/archive/v5.0.0.zip" --output-document "inuit.css.zip"
unzip "inuit.css.zip"
rm -r ../../public/css/inuit
mv --no-target-directory "inuit.css-5.0.0" ../../public/css/inuit

# Resize images
# https://github.com/excellenteasy/grunt-image-resize/blob/v1.0.0/tasks/image_resize.js#L91
# https://github.com/aheckmann/gm/blob/1.21.1/lib/args.js#L714-L724
if which convert &> /dev/null; then
  # Downsize retina sprites
  for src_file in public/images/sprites/*-2x.png; do
    # Convert `twitter-2x.png` to `twitter.png`
    target_filename="$(basename "$src_file" | sed "s/-2x.png/.png/")"
    # Save to `public/images/sprites/twitter.png`
    target_file="public/images/sprites/$target_filename"

    # Downsize image to 50%
    convert "$src_file" -resize 50%x50% "$target_file"
  done

  # Make support images constant size
  for src_file in public/images/support_src/*.png; do
    # Extract `bitcoin.png` from `public/images/support_src/bitcoin.png`
    target_filename="$(basename "$src_file")"
    # Save to `public/images/support/bitcoin.png`
    target_file="public/images/support/$target_filename"

    # Resize to constant height of 25px
    convert "$src_file" -resize x25 "$target_file"
  done
else
  echo "ImageMagick not found. Skipping downsizing of retina images. Please install it to perform downsizing" 1>&2
fi

# Build highlight.js
# Language options are here:
#   https://github.com/isagalaev/highlight.js/tree/9.1.0/src/languages
      # 'bash.js': 'on' \
      # 'css.js': 'on' \
      # 'javascript.js': 'on' \ # alias: js
      # 'markdown.js': 'on' \
      # 'php.js': 'on' \
      # 'python.js': 'on' \ # alias: yaml
      # 'ruby.js': 'on' \
      # 'xml.js': 'on' \ # alias: HTML
