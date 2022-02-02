const assert = require('assert');
const stringComponent = require('./stringComponent');
describe('stringComponent', function() {
    it('camelToSlug', function() {
        const cameled = stringComponent.camelToSlug('thisIsTest')
        assert.equal(cameled, 'this-is-test');
    });  
});
