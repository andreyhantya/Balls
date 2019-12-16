const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

function random(min, max) { //рандом с произвольными значениями
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDistance(ball1, ball2) { // находим расстояние между объектами
    return Math.sqrt(Math.pow(ball1.center.x - ball2.center.x, 2) + Math.pow(ball1.center.y - ball2.center.y, 2));
}

const ballsStore = [];


class Balls {
    radius = random(10, 30);
    ballColor = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
    speed = random(1, 10);
    directionAngle = random(0, 360); // угол направления

    center = {
        x: 0,
        y: 0,
    };

    direction = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed,
    };

    drawBalls = () => { //отрисовка шарика
        c.beginPath();
        c.fillStyle = this.ballColor;
        c.strokeStyle = this.ballColor;
        c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        c.stroke();
        c.fill();
    };

    getBallsProp = (event) => { // получение стартового положения центра шарика (при создании по клику)
        this.center.x = event.clientX;
        this.center.y = event.clientY;
    };

    moveBalls = () => { // смена положения шарика
        this.center.x += this.direction.x;
        this.center.y -= this.direction.y;
    };

    changeSpeed = () => { // корекция скорости объекта
        this.direction.x = Math.cos(this.directionAngle) * this.speed;
        this.direction.y = Math.sin(this.directionAngle) * this.speed;

        return this.direction;
    };

    swallow = () => { //поглощает меньший объект
        ballsStore.forEach((item, index) => {
            let collision = this.radius + item.radius; // маркер касания

            if (getDistance(this, item) <= (collision)) { //поглощает при касании

                if (this.radius > item.radius && this.radius >= 10) {
                    let newRadius = this.radius + item.radius;

                    if (newRadius < 250) { // задаем новый радиус по заданию
                        this.radius = newRadius;
                    }

                    this.speed = (this.radius / (this.radius + item.radius)) * this.speed; // уменьшаем скорость пропорционально радиусу меньшего шара
                    this.changeSpeed(); // меняем скорость объекта

                    ballsStore.splice(index, 1); // удаляем меньший шар
                }

            }

        });
    };

    borderBounce = () => { //Отбивание от стен
        let rad = this.radius;

        this.center.x + rad > canvas.width ? this.center.x = canvas.width - rad : this.center.x;

        if (this.center.x + rad === canvas.width) {
            this.direction.x *= -1;
        }

        this.center.y + rad > canvas.height ? this.center.y = canvas.height - rad : this.center.y;

        if (this.center.y + rad === canvas.height) {
            this.direction.y *= -1;
        }

        this.center.x - rad < 0 ? this.center.x = rad : this.center.x;

        if (this.center.x - rad === 0) {
            this.direction.x *= -1;
        }

        this.center.y - rad < 0 ? this.center.y = rad : this.center.y;

        if (this.center.y - rad === 0) {
            this.direction.y *= -1;
        }

    };
}


function step() { // сценарий шага анимации для поля canvas
    c.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ballsStore.forEach(elem => {
        elem.drawBalls();
        elem.moveBalls();
        elem.borderBounce();
        elem.swallow();
    });

}

setInterval(step, 50); // анимация

function init(event) { // создание нового шарика
    const ball = new Balls();
    ballsStore.push(ball);
    ball.getBallsProp(event);
}

function boomBalls(event, stringColor) { //Разбитие шарика на мелкие шарики
    ballsStore.forEach((elem, index, arr) => {

        if (elem.ballColor === stringColor) {
            arr.splice(index, 1);
        }

    });

    for (let j = 0; j <= 8; j++) { //Создание 8 шариков
        const ball = new Balls();
        ball.radius = random(2, 6);
        ballsStore.push(ball);
        ball.getBallsProp(event);
    }
}

function checkClick(event) { //Условие на проверку клика
    let color = c.getImageData(event.clientX - 10, event.clientY - 10, 1, 1).data;

    if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
        init(event);
    } else {
        let stringColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        boomBalls(event, stringColor);
    }

}

canvas.addEventListener('click', checkClick);

function deleteBalls(event) { //Удаление шарика
    let color = c.getImageData(event.clientX - 10, event.clientY - 10, 1, 1).data; //получает цвет под курсором мыши при клике
    let stringColor = `rgb(${color[0]},${color[1]},${color[2]})`; // переводит цвет в строку для сравнения с цветом шарика

    ballsStore.forEach((elem, index, arr) => {

        if (elem.ballColor === stringColor) {
            arr.splice(index, 1);
        }

    });
}

window.addEventListener("contextmenu", (event) => event.preventDefault(), false);

canvas.addEventListener("contextmenu", deleteBalls);
