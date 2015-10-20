/*** Presence Z-Way HA module *******************************************

Version: 1.00
(c) Maroš Kollár, 2015
-----------------------------------------------------------------------------
Author: maros@k-1.com <maros@k-1.com>
Description:
    Module to set and display presence modes.

******************************************************************************/

function Presence (id, controller) {
    // Call superconstructor first (AutomationModule)
    Presence.super_.call(this, id, controller);
    
    self.presenceDev    = undefined;
    self.vacationDev    = undefined;
}

inherits(Presence, AutomationModule);

_module = Presence;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Presence.prototype.init = function (config) {
    Presence.super_.prototype.init.call(this, config);

    var self = this;
    var langFile = self.controller.loadModuleLang("Presence");

    // Create vdev
    this.presenceDev = this.controller.devices.create({
        deviceId: "Presence_" + this.id,
        defaults: {
            metrics: {
                title: langFile.title,
                level: 'off',
                season: self.calculatePresence()
            }
        },
        overlay: {
            deviceType: 'toggleButton'
        },
        handler: function(command) {
            if (command === 'on') {
                self.vDev.set('metrics:level','on');
                self.switchPresence();
            }
        },
        moduleId: this.id
    });
    
    

};


Presence.prototype.stop = function () {
    var self = this;
    
    if (self.presenceDev) {
        self.controller.devices.remove(self.presenceDev.id);
        self.presenceDev = undefined;
    }
    
    if (self.vacationDev) {
        self.controller.devices.remove(self.vacationDev.id);
        self.vacationDev = undefined;
    }
    
    Presence.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

