var Namespace = {
    Register: function (namespace) {
        var isExist = false;
        var objectPath = '';
        var namespaceParts = namespace.split('.');

        for (var i = 0; i < namespaceParts.length; i++) {
            if (objectPath !== '') {
                objectPath += '.';
            }

            objectPath += namespaceParts[i];
            isExist = this.Exists(objectPath);

            if (!isExist) {
                this.Create(objectPath);
            }
        }

        if (isExist) {
            throw 'Namespace: ' + namespace + ' is already defined.';
        }
    },

    Create: function (objectName) {
        eval('window.' + objectName + ' = new Object();');
    },

    Exists: function (objectName) {
        eval("var isExist = false; try{if(" + objectName + "){isExist = true;}else{isExist = false;}}catch(err){isExist=false;}");

        return isExist;
    }
};

var InheritanceManager = {
};

InheritanceManager.extend = function (subClass, baseClass) {
    subClass.prototype = new baseClass();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
}