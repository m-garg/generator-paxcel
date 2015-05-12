var yeoman = require('yeoman-generator');
//var execSync = require('child_process').execSync;
var child_process = require('child_process');
var GitHubApi = require('github');
var chalk = require('chalk');

var githubOptions = {
  version: '3.0.0'
};

var github = new GitHubApi(githubOptions);

var githubAuth = function(username,password){
	github.authenticate({
		type: "basic",
		username: username,
		password: password
});
};
   
module.exports = yeoman.generators.Base.extend({
	
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  projectPrompting: function () {
    var cb = this.async();

    this.log(chalk.magenta("It\"s time to get Jekyllized!"));
	this.log(chalk.blue("Make your that the directory in which you are running the command is empty"));
    this.log(chalk.yellow("\nTell me a little about your project »"));

    var prompts = [{
      name: "projectName",
      message: "What is the name of your project?"
    }, {
      name: "projectDescription",
      message: "Describe your project for me:"
    }, {
      name: "projectTagline",
      message: "What is the tag line for your project?"
    },{
		name: "projectKeywords",
		message: "Give the keywords related to your website"
	},{
		name: "cname",
		message : "If you want to use custom domain for this website, enter it " + chalk.yellow("Leave blank if you don't want to use custom domain"),
		default:""
	}];

    this.prompt(prompts, function (props) {
      this.projectName        = props.projectName;
      this.projectDescription = props.projectDescription;
      this.projectTagline     = props.projectTagline;
	  this.projectKeywords    = props.projectKeywords;
      this.cname			  = props.cname;

      cb();
    }.bind(this));
  },

  authorPrompting: function () {
    var cb = this.async();

    this.log(chalk.yellow("\nNow it\"s time to tell me about you. »"));

    var prompts = [{
      name: "authorName",
      message: "What is your name?",
    }, {
      name: "authorEmail",
      message: "What is your email?",
    }, {
      name: "authorBio",
      message: "Write a short description of yourself:"
    }, {
      name: "authorTwitter",
      message: "Your Twitter user name:"
    }];

    this.prompt(prompts, function (props) {
      this.authorName      = props.authorName;
      this.authorEmail     = props.authorEmail;
      this.authorBio       = props.authorBio;
      this.authorTwitter   = props.authorTwitter;

      cb();
    }.bind(this));
  },

/*  jekyllPrompting: function () {
    var cb = this.async();

    this.log(chalk.yellow("\nNow on to set some Jekyll settings: »") +
            chalk.red("\nYou can change all of this later in the _config.yml file"));

    var prompts = [{
      name: "jekyllPermalinks",
      type: "list",
      message: "Permalink style" + (chalk.red(
                     "\n  pretty: /:year/:month/:day/:title/" +
                     "\n  date:   /:year/:month/:day/:title.html" +
                     "\n  none:   /:categories/:title.html")) + "\n",
      choices: ["pretty", "date", "none"]
    }, {
      name: "jekyllPaginate",
      message: "How many posts do you want to show on your front page?" + chalk.red("\nMust be a number or all"),
      default: 10,
      validate: function (input) {
        if (/^[0-9]*$/.test(input)) {
          return true;
        }
        if (/^all*$/i.test(input)) {
          return true;
        }
        return "Must be a number or all";
      }
    }];

    this.prompt(prompts, function (props) {
      this.jekyllPermalinks   = props.jekyllPermalinks;
      this.jekyllPaginate     = props.jekyllPaginate;

      cb();
    }.bind(this));
  },*/

  githubPrompting: function () {
    var cb = this.async();

    this.log(chalk.yellow("\nNow it\"s time to tell about Github account. »"));

    var prompts = [{
      name: "githubUserName",
      message: "What is your Github username?",
    }, {
      name: "githubPassword",
	  type: 'password',
      message: "What is your password?",
    }, {
      name: "githubRepoName",
      message: "Give the new repository name to create",
	  default: "my-site"
    }];

    this.prompt(prompts, function (props) {
      this.githubUserName      = props.githubUserName;
      this.githubPassword      = props.githubPassword;
      this.githubRepoName      = props.githubRepoName;

      cb();
    }.bind(this));
  },
  
  scaffolding: function () {
	this.template("_includes/about.html", "_includes/about.html");
	this.template("_includes/clients.html", "_includes/clients.html");
	this.template("_includes/contact.html", "_includes/contact.html");
	this.template("_includes/footer.html", "_includes/footer.html");
	this.template("_includes/head.html", "_includes/head.html");
	this.template("_includes/header.html", "_includes/header.html");
	this.template("_includes/js.html", "_includes/js.html");
	this.template("_includes/modals.html", "_includes/modals.html");
	this.template("_includes/portfolio_grid.html", "_includes/portfolio_grid.html");
	this.template("_includes/services.html", "_includes/services.html");
	this.template("_includes/team.html", "_includes/team.html");
	this.template("_includes/css/agency.css", "_includes/css/agency.css");
	this.copy("_includes/css/bootstrap.min.css", "_includes/css/bootstrap.min.css");
	this.template("_layouts/style.css", "_layouts/style.css");
	this.template("_layouts/default.html", "_layouts/default.html");
	this.directory('_posts', '_posts');
	this.directory('_plugins', '_plugins');
	this.directory('css', 'css');
	this.directory('fonts', 'fonts');
	this.directory('mail', 'mail');
	this.directory('img', 'img');
	this.directory('js', 'js');
	this.template("cname", "cname");
	this.copy('_config.yml','_config.yml');
	this.copy('feed.xml','feed.xml');
	this.copy('style.css','style.css');
	this.copy('index.html','index.html');
	this.copy('README.md','README.md');

   /* if (this.amazonCloudfrontS3) {
      this.template("conditionals/_aws-credentials.json", "aws-credentials.json");
    }
    else if (this.rsync) {
      this.template("conditionals/_rsync-credentials.json", "rsync-credentials.json");
    }*/
  },

  conflicts: function () {
	  	githubAuth(this.githubUserName,this.githubPassword);
		var githubRepoName=this.githubRepoName;
		var githubUserName=this.githubUserName;
		github.repos.create({
		name: githubRepoName
},function(err,res){
	if (err){
		console.log(chalk.red("\nError creating new repository : "+err));
		if(err.errors.message == "name already exists on this account" ){
			console.log(chalk.red("Repository already exists"));
		}
		else{
			console.log(chalk.red(err));
		}
		process.exit(1);
	}
	else{
		console.log(chalk.green("\nNew repository created: "+githubRepoName));
	}
	child_process.execSync('git init'); 
    child_process.execSync('git add .');
	child_process.execSync('git config core.autocrlf true');
    child_process.execSync('git commit -m "Initial_commit"');
    child_process.execSync('git remote add origin https://github.com/'+githubUserName+'/'+githubRepoName+'.git');
	child_process.execSync('git branch gh-pages');
	console.log(chalk.yellow("\nPlease enter your Github username and password again."));
	child_process.execSync('git push origin gh-pages');
	console.log(chalk.green("\nEverything done : You site is now live on "));
	console.log(chalk.yellow(githubUserName + ".github.io/" + githubRepoName));
});
  },
  
  install: function() {

  }
});
