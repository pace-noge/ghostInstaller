/* Compiled by kdc on Sat Oct 26 2013 08:33:12 GMT+0000 (UTC) */
(function() {
/* KDAPP STARTS */
/* BLOCK STARTS: /home/nasa/Applications/ghostInstaller.kdapp/app/core.coffee */
var HOME, Installer, USER,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

USER = KD.nick();

HOME = "/home/" + USER;

Installer = {
  Core: {},
  Utilities: {},
  Models: {},
  Views: {},
  Settings: {
    defaultIcon: "https://koding.com/images/default.app.thumb.png"
  }
};

Installer.Views.BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView(options, data) {
    if (options == null) {
      options = {};
    }
    BaseView.__super__.constructor.call(this, options, data);
  }

  BaseView.prototype.viewAppended = function() {
    this.delegateElements();
    return this.setTemplate(this.pistachio());
  };

  return BaseView;

})(JView);

Installer.Core.Recipe = (function() {
  function Recipe() {}

  Recipe.prototype.name = "An Installer";

  Recipe.prototype.description = "An installer recipe";

  Recipe.prototype.depends = [];

  Recipe.prototype.install = false;

  Recipe.prototype.terminal = false;

  Recipe.prototype.uninstall = false;

  Recipe.prototype.manage = false;

  return Recipe;

})();
/* BLOCK STARTS: /home/nasa/Applications/ghostInstaller.kdapp/recipe/installer.coffee */
var AppInstaller, Recipe, Settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Settings = Installer.Settings;

Recipe = Installer.Core.Recipe;

AppInstaller = (function(_super) {
  __extends(AppInstaller, _super);

  function AppInstaller() {
    _ref = AppInstaller.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppInstaller.prototype.name = "ghostInstaller";

  AppInstaller.prototype.icon = "http://" + USER + ".kd.io/.applications/ghostinstaller/resources/icon.png";

  AppInstaller.prototype.desc = "Installer for ghost Blog.";

  AppInstaller.prototype.path = "" + HOME + "/Applications/ghostInstaller.kdapp";

  /*
  Your installation recipe.
  */


  AppInstaller.prototype.install = function(terminal) {
    terminal.open();
    return terminal.runCommand("clear; mkdir ghostApp; cd ghostApp; wget https://ghost.org/zip/ghost-0.3.3.zip; unzip ghost-0.3.3.zip; npm install --production;     mv config.example.js config.js; echo '\"127.0.0.1\"' | sed -e 's/\(host:\)\(.*\)/\host: \"0.0.0.0\"\,/g' config.js");
  };

  /*
  Your application's shell manage recipe. (e.g. "mysql -s" for MySQL, or "python manage.py shell" for Django applications.)
  */


  AppInstaller.prototype.shell = function(terminal) {
    terminal.open();
    return terminal.runCommand("clear; cd ghostApp; sed -e 's/\(host:\)\(.*\)/\host: \"0.0.0.0\"\,/g' config.js; clear;    perl -i -pe 's/host: \'127.0.0.1\'/host : \"0.0.0.0\"' config.js; npm start");
  };

  /*
  The web view of the manage. Can be used for different cases.
  */


  AppInstaller.prototype.manage = function() {
    return appManager.open("Viewer", function() {
      return appManager.getFrontApp().open("http://" + USER + ".kd.io/.applications/ghostinstaller/resources/manager");
    });
  };

  return AppInstaller;

})(Recipe);
/* BLOCK STARTS: /home/nasa/Applications/ghostInstaller.kdapp/app/utilities.coffee */
var Utilities;

Utilities = Installer.Utilities;

Utilities.notify = function(message) {
  return new KDNotificationView({
    title: message
  });
};
/* BLOCK STARTS: /home/nasa/Applications/ghostInstaller.kdapp/app/views.coffee */
var BaseView, notify,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = Installer.Views.BaseView;

notify = Installer.Utilities.notify;

Installer.Views.Dashboard = (function(_super) {
  __extends(Dashboard, _super);

  function Dashboard(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = "installer-dashboard";
    Dashboard.__super__.constructor.call(this, options, data);
    this.terminal = this.options.terminal;
    this.recipe = new AppInstaller;
  }

  Dashboard.prototype.runRecipe = function(cmd) {
    if (typeof cmd === "string") {
      return this.terminal.runCommand(cmd);
    } else if (typeof recipe === "function") {
      return cmd(this.options.terminal);
    }
  };

  Dashboard.prototype.delegateElements = function() {
    var run,
      _this = this;
    run = function(method) {
      return _this.runRecipe(_this.recipe[method](_this.terminal));
    };
    this.buttonsView = new KDView({
      cssClass: "buttons"
    });
    this.buttonsView.addSubView(this.installButton = new KDButtonView({
      title: "Install",
      callback: function() {
        if (!_this.recipe.install) {
          return notify("Installation recipe not found.");
        }
        return run("install");
      }
    }));
    if (this.recipe.shell) {
      this.buttonsView.addSubView(this.shellButton = new KDButtonView({
        title: "Shell",
        callback: function() {
          return run("shell");
        }
      }));
    }
    if (this.recipe.manage) {
      this.buttonsView.addSubView(this.manageButton = new KDButtonView({
        title: "Manage",
        callback: function() {
          return run("manage");
        }
      }));
    }
    if (this.recipe.uninstall) {
      this.buttonsView.addSubView(this.manageButton = new KDButtonView({
        title: "Uninstall",
        callback: function() {
          return run("uninstall");
        }
      }));
    }
    return this.buttonsView.addSubView(this.toggleTerminaButton = new KDButtonView({
      title: "Terminal",
      callback: function() {
        return _this.terminal.toggle();
      }
    }));
  };

  Dashboard.prototype.pistachio = function() {
    return "<header>\n  <img src=\"" + this.recipe.icon + "\" onerror=\"this.src='" + Installer.Settings.defaultIcon + "'\">\n  <div>\n    <h1>" + this.recipe.name + "</h1>\n    <p>\n      " + this.recipe.desc + "\n    </p>\n  </div>\n  {{> this.buttonsView}}\n</header>";
  };

  return Dashboard;

})(BaseView);

Installer.Views.TerminalView = (function(_super) {
  __extends(TerminalView, _super);

  TerminalView.prototype.remote = {};

  TerminalView.prototype.exec = function(command) {
    return this.remote.input(command + "\n");
  };

  TerminalView.prototype.runCommand = function(command) {
    if (command == null) {
      command = false;
    }
    this.open();
    if (command) {
      return this.remote.input(command + "\n");
    }
  };

  TerminalView.prototype.open = function() {
    this.$().addClass("shown");
    return this.webterm.click();
  };

  TerminalView.prototype.close = function() {
    return this.$().removeClass("shown");
  };

  TerminalView.prototype.toggle = function() {
    this.$().toggleClass("shown");
    if (this.$().is(".shown")) {
      return this.webterm.click();
    }
  };

  function TerminalView(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = "installer-terminal";
    TerminalView.__super__.constructor.call(this, options, data);
  }

  TerminalView.prototype.delegateElements = function() {
    var _this = this;
    this.webterm = new WebTermView({
      delegate: this,
      cssClass: "webterm"
    });
    this.webterm.on("WebTermConnected", function(remote) {
      _this.remote = remote;
      return $(window).resize();
    });
    return this.webterm.on("WebTerm.terminated", function() {
      return _this.emit("terminate");
    });
  };

  TerminalView.prototype.pistachio = function() {
    return "{{> this.webterm}}";
  };

  return TerminalView;

})(BaseView);

Installer.Views.MainView = (function(_super) {
  var Dashboard, TerminalView, _ref;

  __extends(MainView, _super);

  _ref = Installer.Views, Dashboard = _ref.Dashboard, TerminalView = _ref.TerminalView;

  function MainView(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = "installer-container";
    MainView.__super__.constructor.call(this, options, data);
  }

  MainView.prototype.delegateElements = function() {
    var _this = this;
    this.terminal = new TerminalView;
    this.terminal.on("terminate", function() {
      _this.terminal.close();
      return KD.utils.wait(700, function() {
        _this.removeSubView(_this.terminal);
        _this.removeSubView(_this.dashboard);
        return _this.viewAppended();
      });
    });
    return this.dashboard = new Dashboard({
      terminal: this.terminal
    });
  };

  MainView.prototype.pistachio = function() {
    return "{{> this.dashboard}}\n{{> this.terminal}}";
  };

  return MainView;

})(BaseView);
/* BLOCK STARTS: /home/nasa/Applications/ghostInstaller.kdapp/index.coffee */
/*
Installer App for Koding Apps
*/

var MainView, Recipe, notify;

Recipe = Installer.Core.Recipe;

notify = Installer.Utilities.notify;

MainView = Installer.Views.MainView;

(function() {
  var error;
  try {
    return appView.addSubView(new MainView);
  } catch (_error) {
    error = _error;
    console.log(error);
    return notify(error);
  }
})();

/* KDAPP ENDS */
}).call();