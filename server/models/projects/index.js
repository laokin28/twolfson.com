// Set up for file references
var scriptsFile = __dirname + '/scripts.json',
    competitionsFile = __dirname + '/competitions.json',
    contributionsFile = __dirname + '/contributions.json';

// Load in all the files
var scripts = require(scriptsFile),
    competitions = require(competitionsFile),
    contributions = require(contributionsFile),
    fs = require('fs'),
    fetchRepoStats = require('./fetchRepoStats'),
    fetchMDNStats = require('./fetchMDNStats');

// Generate a srcUrl and pageUrl for scripts, competitions, and contributions
scripts.forEach(saveSrcUrl);
scripts.forEach(savePageUrl);
competitions.forEach(saveSrcUrl);
competitions.forEach(savePageUrl);
contributions.forEach(saveSrcUrl);
contributions.forEach(savePageUrl);

// Now and every hour from now, update file stats
function noop() {}
function updateScript(script) {
  // If it not a gist, update it
  var github = script.github || '';
  if (github.indexOf('gist') === -1) {
    fetchRepoStats(github, function (err, data) {
      // If there is no error, update the script
      if (!err) {
        if (data.stars !== undefined) { script.stars = data.stars; }
        if (data.forks !== undefined) { script.forks = data.forks; }
      }
    });
  }
}
function updateCompetition(competition) {
  // If it an mdn file, update it
  var mdn = competition.mdn;
  if (mdn) {
    fetchMDNStats(mdn, function (err, data) {
      // If there is no error, update the competition
      if (!err) {
        if (data.views !== undefined) { competition.views = data.views; }
        if (data.likes !== undefined) { competition.likes = data.likes; }
      }
    });
  }
}
function updateStats(cb) {
  // Update each of the types
  scripts.forEach(updateScript);
  competitions.forEach(updateCompetition);
  contributions.forEach(updateScript);

  // If there is a callback, run it
  if (cb) {
    cb();
  }
}

// Every hour, update the stats
// console.log('*** WARNING: OFFLINE FETCH IS DISABLED ***');
var second = 1000,
    everyHour = second * 60 * 60;
setInterval(updateStats, everyHour);

// If we are in production, fetch now
if (!module.parent) {
  process.nextTick(function updateStatsNow () {
    // Sort the scripts and contributions by stars then forks
    function sortRepos(a, b) {
      var aStars = a.stars,
          bStars = b.stars;
      if (aStars < bStars) { return 1; }
      if (aStars > bStars) { return -1; }

      var aForks = a.forks,
          bForks = b.forks;
      if (aForks < bForks) { return 1; }
      if (aForks > bForks) { return -1; }

      var aName = a.name,
          bName = b.name;
      if (aName > bName) { return 1; }
      if (aName < bName) { return -1; }
      return 0;
    }
    scripts.sort(sortRepos);
    contributions.sort(sortRepos);

    // In a minute, save the updates to their respective JSON files
    setTimeout(function () {
      fs.writeFileSync(scriptsFile, JSON.stringify(scripts, null, 2), 'utf8');
      fs.writeFileSync(competitionsFile, JSON.stringify(competitions, null, 2), 'utf8');
      fs.writeFileSync(contributionsFile, JSON.stringify(contributions, null, 2), 'utf8');

      // Exit the program
      console.log('Projects should be updated');
      process.exit();
    }, 2000);
  });
}
global.updateProjects = updateStats;

module.exports = {
  "scripts": scripts,
  "competitions": competitions,
  "contributions": contributions
};

function getSrcUrl(item) {
  // Get the github info and url fallback
  var github = item.github,
      srcUrl = item.srcUrl;

  // If there is a srcUrl, return now
  if (srcUrl !== undefined) {
    return srcUrl;
  }

  // If there is a github repo, use that
  if (github !== undefined) {
    // If the item is a gist, return it as such
    var isGist = github.indexOf('gist') > -1;
    if (isGist) {
      srcUrl = 'https://gist.github.com/' + github.slice(5);
    } else {
    // Otherwise, go with the normal github flow
      srcUrl = 'https://github.com/' + github;
    }
  }

  return srcUrl;
}

function getPageUrl(item) {
  var srcUrl = getSrcUrl(item),
      mdn = item.mdn,
      pageUrl = item.pageUrl;

  // If the pageUrl is not defined
  if (pageUrl === undefined) {
    // and mdn is defined, use that
    if (mdn !== undefined) {
      pageUrl = 'https://developer.mozilla.org/en-US/demos/detail/' + mdn;
    } else {
    // Otherwise, fallback to the srcUrl
      pageUrl = srcUrl;
    }
  }

  return pageUrl;
}

function saveSrcUrl(item) {
  var srcUrl = getSrcUrl(item);
  item.srcUrl = srcUrl;
}

function savePageUrl(item) {
  var pageUrl = getPageUrl(item);
  item.pageUrl = pageUrl;
}
