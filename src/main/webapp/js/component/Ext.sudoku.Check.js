Ext.ns('Ext.sudoku.Check');

Ext.sudoku.Check = Ext.extend(Ext.Panel, {
	renderTo: Ext.getBody(),
	parent: undefined,
	id: 'sudoku-check',
	layout: {
		type: 'table',
		columns: 3
	},
	floating: true,
	shadow: false,
	style: {
		border: '1px solid #494949',
		zIndex: 65530
	},
	initComponent: function() {
		var parentCmp = this.parent;
		var parentEl = parentCmp.getEl();
		var gridEl = this.parent.ownerCt.body;
		
		// 이미 다른곳에 채크창이 띄워져 있으니 닫기
		if(Ext.get(this.id)) {
			Ext.get(this.id).remove();
		}
		
		this.title = '메모',
		this.tools = [{
			id: 'close',
			stopEvent: true,
			scope: this,
			handler: function(e, el, p) {
				this.destroy();
			}
		}];
	
		this.x = parentEl.getX() + parentEl.getWidth() + 2;
		this.y = parentEl.getY() + 2;
		
		this.items = [];
		
		for(var i=0; i < 9 ; i++) {
			var p = new Ext.Panel({
				width: 18,
				padding: '3px 0 3px 0',
				html: '' + (i+1),
				border: false,
				bodyStyle: {
					textAlign: 'center',
					cursor: 'pointer',
					backgroundColor: '#f3f3f3'
				}
			});
	
			p.on('render',function(p) {
				p.body.addClassOnOver('x-sudoku-check-block-over');
					
				p.body.on({
					scope: this,
					click: function(e, el, o) {
						var n = parseInt(el.innerHTML);
						var id = 'check' + '-' + parentEl.id + '-' + n;
						
						// 이미 메모가 체크되어있으면 없애고 끝.
						if(Ext.get(id)) {
							Ext.get(id).remove();
							return;
						}
												
						var w = parseInt(parentEl.getWidth() / 3) - 1;
						var h = parseInt(parentEl.getHeight() /3) - 1;
						
						// top 을 기준으로 top left 구하기
						var i = 1;
						var x = 0;
						var y = 1;
													
						do {
							x++;
							
							if(x > 3) {
								x = 1;
								y += 1;
							}
							
							i++;
						} while (i <= n);
						
						var top = parentEl.getX() + ((x-1) * w) - gridEl.getX() + 1;
						var left = parentEl.getY() + ((y-1) * h) - gridEl.getY() + 2;
						
						var panel = new Ext.Panel({
							renderTo: parentEl,
							id : id,
							floating: true,
							shadow: false,
							border: false,
							width: w,
							height: h,
							x: top,
							y: left,
							cls: 'x-sudoku-check-block',
							html: '' + n,
							listeners: {
								scope: this.parent.ownerCt,
								render: function(c) {
									c.body.on('click', function(e, el, o) {
										this.events.click(e, parentCmp.body, o, this);
									}, this);
								}
							}
						});
					}
				});
				
			}, this); // render listener
			
			this.items[this.items.length] = p;
		}

		Ext.sudoku.Check.superclass.initComponent.call(this);
	},
	listeners: {
		
		render: function(c, l) {
			var delay = 2000;
			var task = new Ext.util.DelayedTask(function() {
				c.getEl().fadeOut({
					remove: true			
				});
			}, this);
			task.delay(delay);
			
			c.getEl().on({
				mouseover: function() {
					task.cancel();
				},
				mouseout: function() {
					task.delay(delay);
				}
			});
		}
		
	}
});

Ext.reg('sudoku-check', Ext.sudoku.Check);