const { expectRevert, time } = require('@openzeppelin/test-helpers');
const MockBEP20 = artifacts.require('MockBEP20');
const IGO = artifacts.require('IGO');

contract('IGO', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.lp = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
    this.igoToken = await MockBEP20.new('WOW', 'WOW', '1000000', { from: minter });

    await this.lp.transfer(bob, '10', { from: minter });
    await this.lp.transfer(alice, '10', { from: minter });
    await this.lp.transfer(carol, '10', { from: minter });
  });

  it('raise not enough lp', async () => {
    // 10 lp raising, 100 igo to offer
    this.igo = await IGO.new(this.lp.address, this.igoToken.address, '20', '30', '100', '10', alice, { from: minter });
    await this.igoToken.transfer(this.igo.address, '100', { from: minter });

    await this.lp.approve(this.igo.address, '1000', { from: alice });
    await this.lp.approve(this.igo.address, '1000', { from: bob });
    await this.lp.approve(this.igo.address, '1000', { from: carol });
    await expectRevert(
      this.igo.deposit('1', {from: bob}),
      'not igo time',
    );

    await time.advanceBlockTo('20');

    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    assert.equal((await this.igo.totalAmount()).toString(), '6');
    assert.equal((await this.igo.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.igo.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.igo.getOfferingAmount(carol)).toString(), '30');
    assert.equal((await this.igo.getOfferingAmount(bob)).toString(), '10');
    assert.equal((await this.igo.getRefundingAmount(bob)).toString(), '0');
    await expectRevert(
      this.igo.claim({from: bob}),
      'not claim time',
    );

    await time.advanceBlockTo('30');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '7');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '0');
    await this.igo.claim({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '7');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '30');
    await expectRevert(
      this.igo.claim({from: carol}),
      'nothing to claim',
    );

  })

  it('raise enough++ lp', async () => {
    // 10 lp raising, 100 igo to offer
    this.igo = await IGO.new(this.lp.address, this.igoToken.address, '50', '100', '100', '10', alice, { from: minter });
    await this.igoToken.transfer(this.igo.address, '100', { from: minter });

    await this.lp.approve(this.igo.address, '1000', { from: alice });
    await this.lp.approve(this.igo.address, '1000', { from: bob });
    await this.lp.approve(this.igo.address, '1000', { from: carol });
    await expectRevert(
      this.igo.deposit('1', {from: bob}),
      'not igo time',
    );

    await time.advanceBlockTo('50');

    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    assert.equal((await this.igo.totalAmount()).toString(), '18');
    assert.equal((await this.igo.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.igo.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.igo.getOfferingAmount(carol)).toString(), '50');
    assert.equal((await this.igo.getOfferingAmount(bob)).toString(), '16');
    assert.equal((await this.igo.getRefundingAmount(carol)).toString(), '4');
    assert.equal((await this.igo.getRefundingAmount(bob)).toString(), '2');
    await expectRevert(
      this.igo.claim({from: bob}),
      'not claim time',
    );
    assert.equal((await this.igo.totalAmount()).toString(), '18');

    await time.advanceBlockTo('100');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '0');
    await this.igo.claim({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '5');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '50');
    await expectRevert(
      this.igo.claim({from: carol}),
      'nothing to claim',
    );
    assert.equal((await this.igo.hasClaim(carol)).toString(), 'true');
    assert.equal((await this.igo.hasClaim(bob)).toString(), 'false');

  })

  it('raise enough lp', async () => {
    // 10 lp raising, 100 igo to offer
    this.igo = await IGO.new(this.lp.address, this.igoToken.address, '120', '170', '18', '18', alice, { from: minter });
    await this.igoToken.transfer(this.igo.address, '100', { from: minter });

    await this.lp.approve(this.igo.address, '1000', { from: alice });
    await this.lp.approve(this.igo.address, '1000', { from: bob });
    await this.lp.approve(this.igo.address, '1000', { from: carol });
    await expectRevert(
      this.igo.deposit('1', {from: bob}),
      'not igo time',
    );

    await time.advanceBlockTo('120');

    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    await this.igo.deposit('1', {from: bob});
    await this.igo.deposit('2', {from: alice});
    await this.igo.deposit('3', {from: carol});
    assert.equal((await this.igo.totalAmount()).toString(), '18');
    assert.equal((await this.igo.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.igo.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.igo.getOfferingAmount(carol)).toString(), '9');
    assert.equal((await this.igo.getOfferingAmount(minter)).toString(), '0');
    assert.equal((await this.igo.getOfferingAmount(bob)).toString(), '3');
    assert.equal((await this.igo.getRefundingAmount(carol)).toString(), '0');
    assert.equal((await this.igo.getRefundingAmount(bob)).toString(), '0');
    await expectRevert(
      this.igo.claim({from: bob}),
      'not claim time',
    );
    assert.equal((await this.igo.totalAmount()).toString(), '18');

    await time.advanceBlockTo('170');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '0');
    await this.igo.claim({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.igoToken.balanceOf(carol)).toString(), '9');
    await expectRevert(
      this.igo.claim({from: carol}),
      'nothing to claim',
    );
    assert.equal((await this.igo.hasClaim(carol)).toString(), 'true');
    assert.equal((await this.igo.hasClaim(bob)).toString(), 'false');
    assert.equal((await this.igo.getAddressListLength()).toString(), '3');

  })
});
