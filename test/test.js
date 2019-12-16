describe('getDistance', function () {
    it('should return distance', () => {
        let ball1 = new Balls();
        let ball2 = new Balls();
        ball1.center.x = 10;
        ball1.center.y = 10;
        ball2.center.x = 50;
        ball2.center.y = 50;

        const actual = Math.floor(getDistance(ball1, ball2));

        const expected = 56;
        assert.strictEqual(actual, expected);
    });
});

describe('checkClick', () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call init by click on empty area', () => {
        const event = {
            clientX: 5,
            clientY: 5,
        };
        const stub = sandbox.stub(window, 'init');

        checkClick(event);

        sandbox.assert.calledOnce(stub);
        sandbox.assert.calledWith(stub, event);
    });

    it('should call boomBalls by click on ball', () => {
        c.beginPath();
        c.fillStyle = '#f00';
        c.strokeStyle = '#f00';
        c.arc(50, 50, 50, 0, 2 * Math.PI);
        c.stroke();
        c.fill();
        const event = {
            clientX: 50,
            clientY: 50,
        };
        const stub = sandbox.stub(window, 'boomBalls');

        checkClick(event);

        sandbox.assert.calledOnce(stub);
        sandbox.assert.calledWith(stub, event);
    });

});