'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

function certifyCorrectStructure(result) {
    var properties = Object.getOwnPropertyNames(result);
    assert.typeOf(result, 'object');
    assert.lengthOf(properties, 4);
    properties.forEach(function (propertyName) {
        assert.typeOf(result[propertyName], 'string');
    });
}

var availableColors = {
    aqua: {
        aqua: {
            light: {
                background: '#aefeff',
                text: '#005d5f',
                ui: '#02e4e8',
                uiText: '#005d5f'
            },
            regular: {
                background: '#4ffcff',
                text: '#005d5f',
                ui: '#005d5f',
                uiText: '#ffffff'
            },
            dark: {
                background: '#02e4e8',
                text: '#005d5f',
                ui: '#aefeff',
                uiText: '#005d5f'
            }
        }
    }
};

var availableTones = [
    'ultralight',
    'lighter',
    'light',
    'regular',
    'dark',
    'darker'
];

describe('colorMatrixHelper', function () {
    var colorMatrixHelper = proxyquire(
        '../../../../../cartridges/app_havaianas_base/cartridge/scripts/helpers/colorMatrixHelper', {
            'dw/web/Resource': require('../../../../mocks/dw/web/ResourceHavaianas.js'),
            'dw/system/System': {
                getPreferences: function () {
                    return {
                        getCustom: function () {
                            return {
                                hav_colorMatrix_aqua: JSON.stringify(availableColors.aqua),
                                hav_colorMatrix_toneIndex: JSON.stringify(availableTones)
                            };
                        }
                    };
                }
            }
        });

    describe('#getColorSpecification()', function () {
        global.empty = function (subject) {
            if (subject === null || subject === undefined) {
                return true;
            }
            if ((typeof subject === 'string' || Array.isArray(subject)) && !subject.length) {
                return true;
            }

            if (typeof subject === 'object' && !Object.getOwnPropertyNames(subject).length) {
                return true;
            }

            return false;
        };

        var colorChoice = 'aqua';
        var colorObject = availableColors[colorChoice][colorChoice];

        describe('should correctly return a object hash:', function () {
            it('passing only the primary color.', function () {
                var result = colorMatrixHelper.getColorSpecification(colorChoice);
                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);
            });

            it('passing only the primary color and tone.', function () {
                var result = colorMatrixHelper.getColorSpecification(colorChoice, 'regular');
                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);
            });

            it('passing the primary color, primary color tone and the secondary color.', function () {
                var result = colorMatrixHelper.getColorSpecification(
                    colorChoice,
                    'regular',
                    colorChoice
                );
                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);
            });

            it('passing all parameters, excluding isSwatch.', function () {
                var result = colorMatrixHelper.getColorSpecification(
                    colorChoice,
                    'regular',
                    colorChoice,
                    'regular'
                );
                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);
            });

            it('passing all parameters, with isSwatch assuming both states of true and false', function () {
                var result = colorMatrixHelper.getColorSpecification(
                    colorChoice,
                    'regular',
                    colorChoice,
                    'regular',
                    true
                );

                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);

                result = colorMatrixHelper.getColorSpecification(
                    colorChoice,
                    'regular',
                    colorChoice,
                    'regular',
                    false
                );

                certifyCorrectStructure(result);
                assert.deepEqual(result, colorObject.light);
            });
        });
    });
});
