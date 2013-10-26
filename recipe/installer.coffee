{Settings}  = Installer
{Recipe}    = Installer.Core

class AppInstaller extends Recipe

  # Chose a name for your install recipe.
  name: "ghostInstaller"
  icon: "http://#{USER}.kd.io/.applications/ghostinstaller/resources/icon.png" # Settings.defaultIcon
  desc: """
        Installer for ghost Blog.
        """
  path: "#{HOME}/Applications/ghostInstaller.kdapp"
  
  ###
  Your installation recipe.
  ###
  install: (terminal)->
    terminal.open()
    terminal.runCommand "clear; mkdir ghostApp; cd ghostApp; wget https://ghost.org/zip/ghost-0.3.3.zip; unzip ghost-0.3.3.zip; npm install --production; 
    mv config.example.js config.js; echo '\"127.0.0.1\"' | sed -e 's/\(host:\)\(.*\)/\host: \"0.0.0.0\"\,/g' config.js"
    # You can use KD Framework here.
  
  ###
  Your application's shell manage recipe. (e.g. "mysql -s" for MySQL, or "python manage.py shell" for Django applications.)
  ###
  shell: (terminal)->
    terminal.open()
    terminal.runCommand "clear; cd ghostApp; sed -e 's/\(host:\)\(.*\)/\host: \"0.0.0.0\"\,/g' config.js; clear;
    perl -i -pe 's/host: \'127.0.0.1\'/host : \"0.0.0.0\"' config.js; npm start"
  
  ###
  The web view of the manage. Can be used for different cases.
  ###
  manage: ->
    appManager.open "Viewer", ->
      appManager.getFrontApp().open "http://#{USER}.kd.io/.applications/ghostinstaller/resources/manager"
      