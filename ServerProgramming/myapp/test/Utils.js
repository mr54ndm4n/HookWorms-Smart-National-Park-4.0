var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var utils = require("../Utils");

describe('compareTime', function() {
    it('should determine correctly', function() {
        let filter_time = new Date("2018-01-10 14:35:04");
        expect(utils.compareTime(filter_time, new Date("2018-01-10 14:32:57"))).to.eql(true);
        expect(utils.compareTime(filter_time, new Date("2018-01-10 14:39:11"))).to.eql(false);
        expect(utils.compareTime(filter_time, new Date("2018-01-10 12:32:57"))).to.eql(false);
    });

});
