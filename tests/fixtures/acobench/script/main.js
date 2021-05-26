var game = g.game;

module.exports = function () {
	var scene = new g.Scene({
		game: game,
		name: "entry-scene",
		assetIds: ["aco"]
	});

	var random = game.external.getSeed ? new g.XorshiftRandomGenerator(game.external.getSeed()) : g.game.random;

	scene.loaded.handle(function () {
		var canvas = new g.Pane({
			scene: scene,
			x: game.width / 2,
			y: game.height / 2,
			width: game.width,
			height: game.height,
			anchorX: 0.5,
			anchorY: 0.5,
			touchable: true
		});
		canvas.onUpdate.add(function () {
			canvas.angle++;
			canvas.modified();
		});
		scene.append(canvas);

		var bg = new g.FilledRect({
			scene: scene,
			width: game.width,
			height: game.height,
			cssColor: "black"
		});
		canvas.append(bg);

		var center = [game.width / 2, game.height / 2, 5.0];
		var origin = center.concat();
		canvas.onPointDown.handle(function (o) {
			origin[0] = center[2] * (o.point.x - center[0]);
			origin[1] = center[2] * (o.point.y - center[1]);
		});
		canvas.onPointMove.handle(function (o) {
			origin[0] += center[2] * o.prevDelta.x;
			origin[1] += center[2] * o.prevDelta.y;
		});

		for (var i = 0; i < 100; i++) {
			(function () {
				var object = new g.FrameSprite({
					scene: scene,
					src: scene.asset.getImageById("aco"),
					width: 32,
					height: 48,
					compositeOperation: g.CompositeOperation.Lighter,
					frames: [5, 6, 7, 6]
				});
				object.r = [];
				object.v = [];
				object.p = [];

				canvas.append(object);
				object.init = function () {
					object.time = 0;
					object.life = 10 + random.generate() * 90;

					object.r = origin.concat();
					object.v[0] = 0.0;
					object.v[1] = 0.0;
					object.v[2] = 0.0;
					object.p[0] = (-100 + random.generate() * 200) * 0.01;
					object.p[1] = (-100 + random.generate() * 200) * 0.01;
					object.p[2] = (-100 + random.generate() * 200) * 0.0001;
				};
				object.init();
				object.start();
				object.onUpdate.handle(function () {
					if (++object.time > object.life) {
						object.init();
					}

					object.v[0] += object.p[0]; object.v[1] += object.p[1]; object.v[2] += object.p[2];
					object.r[0] += object.v[0]; object.r[1] += object.v[1]; object.r[2] += object.v[2];

					if (object.r[2] < 0.2) {
						object.init();
					}
					var w = 1.0 / object.r[2];

					object.width = 32 * w;
					object.height = 48 * w;
					object.x = object.r[0] * w - object.width * 0.5 + center[0];
					object.y = object.r[1] * w - object.height * 0.5 + center[1];
					object.invalidate();
				});
			})();
		}
	});

	game.pushScene(scene);
};
