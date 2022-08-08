const app = getApp()

Page({
    data: {},
    onLoad: function () {
        this.time = 0;
        this.deg_to_pi = Math.PI / 180; //固定值
        this.color_gold = '176, 162, 242'; //主题色
        this.color_bg = '#FFFFFF'; //背景色
        //初始化扫描元素
        // this.enemies = Array(10)
        // .fill({})
        // .map(function(b) {
        //   return {
        //     r: Math.random() * 200,
        //     deg: Math.random() * 360,
        //     opacity: 0
        //   }
        // });

        // 通过 SelectorQuery 获取 Canvas 节点
        wx.createSelectorQuery()
            .select('#canvas')
            .fields({
                node: true,
                size: true,
            })
            .exec(this.init.bind(this))
    },

    init(res) {
        const width = res[0].width
        const height = res[0].height

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        this.ww = width;
        this.wh = height;

        var center = {
            x: width / 2,
            y: height / 2
        };

        ctx.restore();
        ctx.translate(center.x, center.y)

        const renderLoop = () => {
            this.render(canvas, ctx)
            canvas.requestAnimationFrame(renderLoop)
        }
        canvas.requestAnimationFrame(renderLoop)
    },

    render(canvas, ctx) {
        ctx.clearRect(0, 0, this.ww, this.wh)
        this.draw(ctx);
    },

    draw(ctx) {
        this.time += 1;
        ctx.fillStyle = this.color_bg;
        ctx.beginPath();
        ctx.rect(-2000, -2000, 4000, 4000);
        ctx.fill();
        ctx.strokeStyle = "rgba(164, 145, 247, 0.3)";
        console.log(this.ww + " wh:" + this.wh)
        ctx.moveTo(-this.ww / 2, 0);
        ctx.lineTo(this.ww / 2, 0);
        ctx.moveTo(0, -this.wh / 2);
        ctx.lineTo(0, this.wh / 2);
        ctx.stroke();
        ctx.strokeStyle = this.Color(1);
        var z = 100; //指针长度
        var D = this.time;
        var v = this.Point(z, D);
        var t = (this.time / 2) % 360;
        var u = 240; //扫描的扇形面积
        for (var i = 0; i < u; i++) {
            var E = (t - i - 1);
            var F = (t - i);
            var x = this.Point(z, E);
            var y = this.Point(z, F);
            var w = 1 - (i / u);
            if (i == 0) {
                w = 1
            }
            ctx.beginPath();
            ctx.fillStyle = this.Color(w);
            ctx.moveTo(0, 0);
            ctx.lineTo(x.x, x.y);
            ctx.lineTo(y.x, y.y);
            ctx.fill()
        }
        var that = this;
        //扫描出显示的元素
        // this.enemies.forEach(function(a) {
        //   ctx.fillStyle = that.Color(a.opacity);
        //   var b = that.Point(a.r, a.deg);
        //   ctx.beginPath();
        //   ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI);
        //   ctx.fill();
        //   ctx.strokeStyle = that.Color(a.opacity);
        //   var d = 6;
        //   ctx.lineWidth = 2;
        //   ctx.beginPath();
        //   ctx.moveTo(b.x - d, b.y + d);
        //   ctx.lineTo(b.x + d, b.y - d);
        //   ctx.moveTo(b.x + d, b.y + d);
        //   ctx.lineTo(b.x - d, b.y - d);
        //   ctx.stroke();
        //   if (Math.abs(a.deg - t) <= 1) {
        //     a.opacity = 1;
        //     // $(".message")
        //     //   .text("Detected: " + a.r.toFixed(3) + " at " + a.deg.toFixed(3))
        //   }
        //   a.opacity *= 0.99;
        //   ctx.strokeStyle = that.Color(a.opacity);
        //   ctx.lineWidth = 1;
        //   ctx.beginPath();
        //   ctx.arc(b.x, b.y, 10 * (1 / (a.opacity + 0.0001)), 0, 2 * Math.PI);
        //   ctx.stroke()
        // });
        ctx.strokeStyle = this.Color(1);
        var A = 120; //固定值
        var G = 15;
        var B = 100; //圆虚线
        var r = 10;
        for (var i = 0; i < A; i++) {
            ctx.beginPath();
            var D = (i / 120) * 360;
            if (i % G == 0) {
                r = 10;
                ctx.lineWidth = 3
            } else {
                r = 5;
                ctx.lineWidth = 1
            }
            var x = this.Point(B, D);
            var y = this.Point(B + r, D);
            ctx.moveTo(x.x, x.y);
            ctx.lineTo(y.x, y.y);
            ctx.stroke()
        }

        function C(that, f, d, a) {
            ctx.lineWidth = d;
            ctx.strokeStyle = that.Color(1);
            ctx.beginPath();
            for (var b = 0; b <= 360; b++) {
                var e = that.Point(f, b);
                if (a(b)) {
                    ctx.lineTo(e.x, e.y)
                } else {
                    ctx.moveTo(e.x, e.y)
                }
            }
            ctx.stroke()
        }
        //绘制最外实线转圈
        C(this, 120, 2, function (a) {
            return ((a + that.time / 10) % 180) < 90
        });
        //绘制虚线
        C(this, 90, 1, function (a) {
            return (a % 3) < 1
        });
        //绘制实线圆
        C(this, 80, 1, function (a) {
            return true
        })
    },

    Point(e, d) {
        return {
            x: e * Math.cos(this.deg_to_pi * d),
            y: e * Math.sin(this.deg_to_pi * d),
        }
    },
    Color(b) {
        return "rgba(" + this.color_gold + "," + b + ")"
    }
})