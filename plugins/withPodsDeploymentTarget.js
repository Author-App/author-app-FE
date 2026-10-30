const { withPodfile } = require('expo/config-plugins');

// Xcode 27 rejects pod targets below iOS 15. Some pods still declare 9.0 to 13.4.
module.exports = (config) =>
  withPodfile(config, (cfg) => {
    cfg.modResults.contents = cfg.modResults.contents.replace(
      'post_install do |installer|',
      `$&
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |c|
        c.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1' if c.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.1
      end
    end`
    );
    return cfg;
  });
