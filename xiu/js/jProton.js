(function($) {
	var jProton = function(ele, options) {
		var me = this;
		ele.width = $(ele).width(), ele.height = $(ele).height();
		var canvas = this.canvas = ele;
		var src = this.src = $(ele);
		// console.log(canvas);
		var bg = new Image();
		bg.src = options.bg;
		bg.onload = function() {
			bg._loaded = true;
		}
		var context = this.context = canvas.getContext('2d');
		var proton = this.proton = new Proton;
		var emitter = this.emitter = new Proton.Emitter;
		emitter.rate = new Proton.Rate(new Proton.Span(1, 3), 1);
		emitter.addInitialize(new Proton.Mass(1));
		emitter.addInitialize(new Proton.Radius(2, 4));
		emitter.addInitialize(new Proton.P(new Proton.LineZone(10,
				canvas.height, canvas.width - 10, canvas.height)));
		emitter.addInitialize(new Proton.Life(1, 1.5));
		emitter.addInitialize(new Proton.V(new Proton.Span(4, 6),
				new Proton.Span(0, 0, true), 'polar'));
		emitter.addBehaviour(new Proton.Gravity(1));
		emitter.addBehaviour(new Proton.Color('#ff0000', 'random'));
		emitter.emit();
		proton.addEmitter(emitter);

		var renderer = this.renderer = new Proton.Renderer('canvas', proton,
				canvas);
		renderer.onProtonUpdate = function() {
			if (!options.bg || !bg._loaded) {
				context.fillStyle = "rgba(0, 0, 0, 0.1)";
				context.fillRect(0, 0, canvas.width, canvas.height);
			} else {
				context.drawImage(bg, 0, 0, canvas.width, canvas.height);
			}
			// if (bg._loaded) {
			// context.drawImage(bg, 0, 0, canvas.width, canvas.height);
			// }

		};
		renderer.start();
		emitter.addEventListener(Proton.PARTICLE_DEAD, function(e) {
					if (Math.random() < 0.7)
						me.createFirstEmitter(e.particle);
					else
						me.createSecendEmitter(e.particle);
				});
		for (var key in jProton.prototype) {
			if (typeof jProton.prototype[key] == 'function') {
				this[key] = jProton.prototype[key].bind(this)
			}
		}

	};
	$.extend(jProton.prototype, {
				constructor : jProton,
				createFirstEmitter : function(particle) {
					var subemitter = new Proton.Emitter();
					subemitter.rate = new Proton.Rate(
							new Proton.Span(250, 300), 1);
					subemitter.addInitialize(new Proton.Mass(1));
					subemitter.addInitialize(new Proton.Radius(1, 2));
					subemitter.addInitialize(new Proton.Life(1, 3));
					subemitter.addInitialize(new Proton.V(
							new Proton.Span(2, 4), new Proton.Span(0, 360),
							'polar'));
					subemitter
							.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
					subemitter.addBehaviour(new Proton.Alpha(1, 0));
					subemitter.addBehaviour(new Proton.Gravity(3));
					var color = Math.random() > 0.3 ? Proton.MathUtils
							.randomColor() : 'random';
					subemitter.addBehaviour(new Proton.Color(color));
					subemitter.p.x = particle.p.x;
					subemitter.p.y = particle.p.y;
					subemitter.emit('once', true);
					this.proton.addEmitter(subemitter);
				},
				createSecendEmitter : function(particle) {
					var subemitter = new Proton.Emitter();
					subemitter.rate = new Proton.Rate(
							new Proton.Span(100, 120), 1);
					subemitter.addInitialize(new Proton.Mass(1));
					subemitter.addInitialize(new Proton.Radius(4, 8));
					subemitter.addInitialize(new Proton.Life(1, 2));
					subemitter.addInitialize(new Proton.V([1, 2],
							new Proton.Span(0, 360), 'polar'));
					subemitter.addBehaviour(new Proton.Alpha(1, 0));
					subemitter.addBehaviour(new Proton.Scale(1, 0.1));
					subemitter.addBehaviour(new Proton.Gravity(1));
					var color = Proton.MathUtils.randomColor();
					subemitter.addBehaviour(new Proton.Color(color));
					subemitter.p.x = particle.p.x;
					subemitter.p.y = particle.p.y;
					subemitter.emit('once', true);
					this.proton.addEmitter(subemitter);
				},
				tick : function() {
					// this.tick = jProton.prototype.tick.bind(this);
					requestAnimationFrame(this.tick);
					this.proton.update();
					if (this.stop)
						return this.requestStop();
					// this.tick();
				},
				requestStop : function() {
					this.renderer.stop();
					delete this.renderer;
					delete this.emitter;
					delete this.proton;
					delete this.context;
					delete this.canvas;
					return;
				}
			});
	$.fn.extend({
				Proton : function(options) {
					var me = this;
					options = $.extend({
								bg : false
							}, options);
					me.each(function(index, ele) {
								var p = new jProton(ele, options);
								$(ele).data("jProton", p);
							});
					return me;
				}
			});
})(jQuery)