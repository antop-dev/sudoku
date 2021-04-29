var sudoku;

Ext.ns('Ext.sudoku.Grid');

Ext.sudoku.Grid = Ext.extend(Ext.Panel, {
	// parent
	parent: undefined,
	// 문제 번호
	seq: undefined,
	// 설정
	config: {
		block: {
			width: 40,
			height: 40
		},
		min: 28, // 최소 숫자 갯수
		max: 32 // 최대 숫자 갯수
	},
	// options
	id: 'sudoku-grid',
	iconCls: 'sudoku-btn-grid',
	floating: true,
	shadow: false,
	// table layout
	layout: 'table',
	layoutConfig: {
		columns: 9
	},
    autoHeight: true,
    // 초기화
	initComponent: function() {
		// 이 그리드를 실행시킨 상위 객체의 가운대에 배치할 수 있도록
		// x, y 좌표를 구한다.
		var parent = this.parent;
		
		this.renderTo = parent.getEl();
		// width
		this.width = this.config.block.width * 9 + 1;
		// height
		this.height = this.config.block.height * 9 + (25*3) + 5;
		if(this.height >= parent.getHeight()) {
			this.height = parseInt(parent.getHeight() * 0.8);
		}
		// x
		this.x = parseInt((parent.getWidth() - this.width) / 2);
		// y
		this.y = parseInt((parent.getHeight() - this.height) /2);
		
		// mask
		parent.body.mask();
				
		// 빈 그리드 그리기
		this.init();

		// render
		Ext.sudoku.Grid.superclass.initComponent.call(this);

		this.on({
			scope: this,
			// 창이 닫히기 전에 타이머를 종료한다.
			beforedestroy: function() {
				Ext.TaskMgr.stopAll();
			},
			afterrender: function() {
				// 화면이 그려진 후 문제 불러오기 실행
				this.load();
			}
		});
	},
	init: function() {
		// 타이틀 세팅
		if(this.seq != null) {
			this.setTitle('문제번호: ' + this.seq);	
		} else {
			this.setTitle('게임 만들기');
		}
		
		// 타이틀 버튼
		this.tools = [{
			id: 'close',
			qtip: '게임을 종료합니다.',
			scope: this,
			handler: this.close
		}];
		
		// 툴바 생성
		this.createTopBar();
		
		// 상태바(타이머)
		var timerId = 'sudoku-times';
		
		this.bbar = new Ext.ux.StatusBar({
			id: 'sudoku-statusbar',
			height: 25,
            text: '',
            iconCls: '',
            items: (this.seq != undefined) ? ['->', '-', {
            	xtype: 'tbtext',
            	id: this.stopWatch.id,
            	text: '0:00:00'
            }] : []
		});
				
		// 화면 초기화
		// 비어있는 9x9 스도쿠 그리드를 그린다.
		this.items = [];
				
		var x = 1;
		var y = 1;
	
		for(var i=0 ; i < 81 ; i++) {
			// 화면에 그려질 패널 컴포넌트
			var p = new Ext.Panel({
				border: false,
				bodyCfg: {
					id: i,
					cls: 'x-sudoku-block',
					style: 'z-undex: 12000;'
				},
				width: this.config.block.width,
				height: this.config.block.height,
				html: '',
				oValue: 0,
				value: 0,
				listeners: {
					scope: this,
					afterrender: function(c) {
						c.body.addClass('x-sudoku-block-editable');
						
						c.body.on({
							scope: this,
							click: this.events.click,
							mouseover: this.events.mouseOver,
							mouseout: this.events.mouseOut
						});
					}
				},
				// method
				removeCheck: function() {
					// 숫자가 입력되면 체크했던 것들 삭제
					for(var i=0; i <= 9 ; i++) {
						var id = 'check' + '-' + this.id + '-' + i;
						
						var check = Ext.get(id);
						if(check) {
							check.remove();
						}
					}
				}
			});

			// style
			if(x == 4 || x == 7) {
				p.addClass('x-sudoku-block-left-solid');
			} else if (x != 1) {
				p.addClass('x-sudoku-block-left-dashed');
			}
						
			if(y == 4 || y == 7) {
				p.addClass('x-sudoku-block-top-solid');
			} else if (y != 1) {
				p.addClass('x-sudoku-block-top-dashed');
			}
			
			if(x % 9 == 0) {
				x = 0;
				y++;
			}
			x++;

			this.items[i] = p;
		} // for
		
		
	},
	status: function(msg, cls) {
		if(msg == undefined) {
			msg = '';
		}
		if(cls == undefined) {
			cls = '';
		}
		
		this.getBottomToolbar().setStatus({
    		text: msg,
    		iconCls: cls
    	});
	},
	createTopBar: function() {
		var items = [];
		
		if(this.seq != undefined) {
			items = [{
				text: '초기화',
				iconCls: 'sudoku-btn-restart',
				tooltip: '게임을 초기화 합니다.',
				handler: this.reset,
				listeners: {
					scope: this,
					render: function(c) {
						this.resetBtn = c;
					}
				}
			}, '-', {
				text: '채점',
				iconCls: 'sudoku-btn-verif',
				tooltip: '채점합니다.',
				handler: this.score,
				listeners: {
					scope: this,
					render: function(c) {
						this.scoreBtn = c;
					}
				}
			}, '-', {
				text: '답안',
				iconCls: 'sudoku-btn-solution',
				tooltip: '답을 확인합니다.',
				handler: this.solve,
				listeners: {
					scope: this,
					render: function(c) {
						this.solveBtn = c;
					}
				}
			}];
			
		} else {
			items =  [{
				text: '등록',
				iconCls: 'sudoku-btn-add',
				handler: this.regist,
				listeners: {
					scope: this,
					render: function(c) {
						this.registBtn = c;
					}
				}
			}, '-', {
				text: '다시 만들기',
				iconCls: 'sudoku-btn-reset',
				handler: this.clear
			}];
		}
		
		this.tbar = new Ext.Toolbar({
			defaults: {
				scope: this
			},
			items: items
		});
			
	},
	load: function() {
		if(this.seq == undefined) {
			return;
		}
		// 문제 불러오기
		this.mask('불러오는 중...');
		this.status('불러오는 중...', 'x-status-busy');
		
		Ext.Ajax.request({
			scope: this,
			url: 'grid/get.do',
			params: {
				seq: this.seq
			},
			success: function(resp, options) {
				var json = Ext.util.JSON.decode(resp.responseText);
				
				if(!json.success) {
					this.status(json.msg, 'x-status-error');
					return;
				}
				
				var array = this.stringToArray(json.sudoku.grid);
				
				// string -> array
				for(var i=0 ; i < this.items.getCount() ; i++) {
					this.getBlock(i).oValue = parseInt(array[i]);
					this.getBlock(i).value = parseInt(array[i]);
				}
				
				for(var i=0 ; i < this.items.getCount() ; i++) {
					var p = this.getBlock(i);
					
					if(p.oValue != 0) {
						p.body.un('click', this.events.click, this);
						
						p.body.removeClass('x-sudoku-block-editable');
						p.body.addClass('x-sudoku-block-bold');
						p.body.addClass('x-sudoku-block-original');
						
						p.update(p.oValue);
					} else {
						p.body.on({
							scope: this,
							contextmenu: this.events.contextmenu
						});
					}
				}
				
				this.stopWatch.start();
				this.status('', '');
				this.mask(false);
			},
			failure: function(resp, options) {
				this.status(resp.statusText, 'x-status-error');
			}
		});
		
	},
	editable: function(bool) {
		if(bool == undefined) {
			bool = true;
		}
		
		for(var i=0 ; i < this.items.getCount() ; i++) {
			var p = this.getBlock(i);
			
			if(p.oValue == 0) {
				if(bool == true) {
					p.body.on('click', this.events.click, this);
					p.body.addClass('x-sudoku-block-editable');
				} else {
					p.body.un('click', this.events.click, this);
					p.body.un('contextmenu', this.events.contextmenu, this);
					p.body.removeClass('x-sudoku-block-editable');
				}
			}
		}
		
	},
	mask: function(o) {
		if(this.rendered) {
			if(o == undefined) {
				o = true;
			}
			
			if(o == true) {
				this.body.mask();
			} else if (o == false) {
				this.body.unmask();
			} else {
				this.body.mask(o, 'x-mask-loading');
			}
		}
		
	},
	reset: function() { // 게임 초기화
		this.resetBtn.setDisabled(true);
		this.scoreBtn.setDisabled(true);
		this.solveBtn.setDisabled(true);
		
		for(var i=0 ; i < this.items.getCount() ; i++) {
			var p = this.getBlock(i);
			p.removeCheck();
			// 값 초기화
			p.value = p.oValue;
			// 레이아웃 초기화
			p.update(p.value != 0 ? p.value : '');
			
			if(p.oValue == 0) {
				p.body.on('click', this.events.click, this);
				p.body.on('contextmenu', this.events.contextmenu, this);
				p.body.on('mouseover', this.events.mouseOver, this);
				p.body.on('mouseout', this.events.mouseOut, this);
				p.body.addClass('x-sudoku-block-editable');
			}
			
		}

		this.scoreBtn.setDisabled(false);
		this.solveBtn.setDisabled(false);
		
		this.stopWatch.reset();
		this.status();
		
		this.resetBtn.setDisabled(false);
	},
	score: function() {
		// 채점 버튼 눌렀을 때의 기록
		var cost = this.stopWatch.get();

		/*
		for(var i=0 ; i < this.items.getCount() ; i++) {
			var p = this.getBlock(i);
			if(p.value == 0) {
				this.status('문제를 전부 풀지 않았습니다.', 'x-status-error');
				return;
			}
		}
		*/

		this.resetBtn.setDisabled(true);
		this.scoreBtn.setDisabled(true);
		this.solveBtn.setDisabled(true);
		
		this.status('채점중...', 'x-status-busy');
		this.mask('채점중...');
					
		// array -> string
		var answer = '';
		for(var i=0 ; i < this.items.getCount() ; i++) {
			answer += this.getBlock(i).value;
		}
		
		Ext.Ajax.request({
			scope: this,
			url: 'grid/correct.do',
			params: {
				'seq': this.seq,
				'answer': answer
			},
			success: function(response, options) {
				var json = Ext.util.JSON.decode(response.responseText);
				
				if(json.correct == true) {
					this.resetBtn.setDisabled(false);
					this.status('문제를 풀었습니다.', 'x-status-saved');
					this.stopWatch.stop();
					this.editable(false);

					Ext.dump(this);
					
					for(var i = 0 ; i < this.items.getCount() ; i++) {
						var p = this.getBlock(i);

						p.body.un('mouseover', this.events.mouseOver, this);
						p.body.un('mouseout', this.events.mouseOut, this);
					}
					
					// 기록 남기기
					var f = new Ext.sudoku.WriteScore({
						parent: this,
						seq: this.seq,
						cost: cost
					});
					
				} else {
					this.status('불일치!', 'x-status-error');
					this.resetBtn.setDisabled(false);
					this.scoreBtn.setDisabled(false);
					this.solveBtn.setDisabled(false);
					this.mask(false);
				}
				
				
			},
			failure: function(resp, options) {
				this.status(resp.statusText, 'x-status-error');
				this.resetBtn.setDisabled(false);
				this.scoreBtn.setDisabled(false);
				this.solveBtn.setDisabled(false);
			}
		});
	},
	solve: function() {
		this.scoreBtn.setDisabled(true);
		this.solveBtn.setDisabled(true);

		this.mask('답안 구하는중...');
		this.status('답안 구하는중...', 'x-status-busy');

		// 지금까지 푼 답
		var grid = [];
		for(var i ; i < this.items.getCount() ; i++) {
			grid[grid.length] = this.getBlock(i).value;
		}
		
		Ext.Ajax.request({
			scope: this,
			url: 'grid/solve.do',
			params: {
				seq: this.seq,
				grid: grid
			},
			success: function(response, options) {
				var json = Ext.util.JSON.decode(response.responseText);

				if(json.solutions.length == 0) {
					this.status('답이 없습니다.', 'x-status-error');
					return;
				}
				
				// 여러개의 답안 중에 처음꺼를 사용
				// array -> string
				var solution = this.stringToArray(json.solutions[0]);
				
				for(var i=0 ; i < this.items.getCount() ; i++) {
					var n = solution[i];
					var p = this.getBlock(i);
					p.removeCheck();
					p.value = n;
					p.update(n);
					
					p.body.un('click', this.events.click, this);
					p.body.un('contextmenu', this.events.contextmenu, this);
					p.body.un('mouseover', this.events.mouseOver, this);
					p.body.un('mouseout', this.events.mouseOut, this);
					p.body.removeClass('x-sudoku-block-editable');
				}
				
				this.status('', '');
				this.editable(false);
				
				this.stopWatch.stop();
				this.stopWatch.set();
			},
			callback: function() {
				this.mask(false);
			}
		});
	},
	regist: function() {
		// 유효성 검사
		var c = 0;
		for(var i=0 ; i < this.items.getCount() ; i++) {
			var p = this.getBlock(i);
			if(p.value != 0) {
				c++;
			}
		}
		
		if(c.constrain(this.config.min, this.config.max) != c) {
			this.status('숫자의 갯수는 최소 ' + this.config.min + ', 최대 ' + this.config.max, 'x-status-error');
			return;
		}						
		
		this.mask('등록중입니다...');
		this.status('등록중입니다...', 'x-status-busy');
		this.registBtn.setDisabled(true);
		
		var grid = '';
		for(var i=0 ; i < this.items.getCount() ; i++) {
			grid += this.getBlock(i).value;
		}
		
		Ext.Ajax.request({
			scope: this,
			url: 'grid/regist.do',
			params: {
				grid: grid
			},
			success: function(response, options) {
				var json = Ext.util.JSON.decode(response.responseText);
				
				if(json.success) {
					this.status('등록 완료 했습니다. (문제 번호: ' + json.seq + ')', 'x-status-valid');
					this.clear();
				} else {
					this.status(json.msg, 'x-status-error');
				}
			},
			failure: function(resp, options) {
				this.status(resp.statusText, 'x-status-error');
			},
			callback: function(options, success, response) {
				this.mask(false);
				this.registBtn.setDisabled(false);
			}
			
		});
	},
	clear: function() {
		for(var i=0 ; i < this.items.getCount() ; i++) {
			var p = this.getBlock(i);
			p.oValue = 0;
			p.value = 0;
			p.update('');
		}
	},
	close: function(e, el, p, tc) {
		var el = Ext.get('sudoku-check');
		if(el) {
			el.remove();
		}
		this.parent.body.unmask();
		this.destroy();
	},
	events: {
		click: function(evt, el, o, grid) {
			var p;
			var idx = parseInt(el.id);
			
			try {
				p = this.getBlock(idx);
				o = this;
			} catch (e) {
				o = grid;
				p = grid.getBlock(idx);
			}
			
			var fm = new Ext.ux.form.SpinnerField({
				width: p.body.getWidth() - 2,
	            minValue: 0,
	            maxValue: 9,
	            selectOnFocus: true,
	            maxLength: 1,
	            style: {
	            	textAlign: 'center'
	            }
	        });
	        var editor = new Ext.Editor(fm, {
	            updateEl: true,
	            shadow: true,
	            allowBlur: false,
	            listeners: {
	            	scope: this,
	                complete: function(c, newVal) {
	                	var n = newVal ? parseInt(newVal) : 0;
	                		                	
	                	// 값 갱신
	                	p.value = n;

	                	p.body.un('contextmenu', o.events.contextmenu, o);
	                	
                		if(p.value != 0) {
	                		p.removeCheck();
	                	} else {
	                		p.body.on('contextmenu', o.events.contextmenu, o);
	                	}
	                	
	                },
	                hide: function(c) {
	                	// editor element(html)가 계속 쌓이게 된다.
	                	// element tag를 삭제 해주자.
	                	c.getEl().remove();
	                }
	            }
	        }, this);
	        
	        fm.on('render', function(c) {
        		c.el.on('blur', function() {
        			editor.completeEdit();
        		}, this);
        	});
			
	        if(el.innerHTML == '') {
	        	editor.startEdit(el.id,'');
	        } else {
	        	editor.startEdit(el.id);
	        }
	        
		},
		contextmenu: function(e, el, o) {
			var p = this.getBlock(parseInt(el.id));
			
			new Ext.sudoku.Check({
				parent: p
			});
		},
		mouseOver: function(e, el, o) {
			var idx = parseInt(el.id);
			var n = this.getBlock(idx).value;

			/*
			var curr = {
				x: 1,
				y: 1
			};
			
			
			for(var i=0 ; i < idx ; i++) {
				if(curr.x == 9) {
					curr.x = 0;
					curr.y += 1;
				}
				
				curr.x += 1;
			}
			*/

			var x = y = 1;
			for(var i=0 ; i < this.items.getCount() ; i++) {
				var p = this.getBlock(i);
				/*
				if( (x == curr.x || y == curr.y) && !(x == curr.x && y == curr.y) ) {
					p.body.addClass('x-sudoku-block-over-line');
				} else {
					p.body.removeClass('x-sudoku-block-over-line');
				}
				*/
				
				if(n == p.value) {
					p.body.addClass('x-sudoku-block-over-color');
				} else {
					p.body.removeClass('x-sudoku-block-over-color');
				}
					
				/*
				if(x == 9) {
					x = 0;
					y += 1;
				}
				
				x += 1;
				*/
			}
		},
		mouseOut: function(e, el, o) {
			for(var i=0 ; i < this.items.getCount() ; i++) {
				var p = this.getBlock(i);
				// p.body.removeClass('x-sudoku-block-over-line');
				p.body.removeClass('x-sudoku-block-over-color');
			}
		}
	},
	// 타이머
	stopWatch: {
		id: 'sudoku-timer',
		getEl: function() {
			return Ext.getCmp(this.id).getEl();
		},
		start: function(reset) { // 타이머 시작
			if(reset == undefined) {
				reset = true;
			}
			
			var el = this.getEl();

			var time = {
				hour: 0,
				min: 0,
				sec: -1
			};
			
			var task = function() {
				time.sec++;
				
				if (time.sec == 60) {
					time.sec = 0;
					time.min += 1;
				}
				
				if (time.min == 60) {
					time.min = 0;
					time.hour += 1;
				}
				
				if(reset == false) {
					var cost = this.get();
				
					try {
						var split = cost.split(':');
						time.hour = parseInt(split[0], 10);
						time.min = parseInt(split[1], 10);
						time.sec = parseInt(split[2], 10) - 1;
					} catch (e) {
						time.hour = 0;
						time.min = 0;
						time.sec = -1;
					}
				}
												
				var hour = time.hour;
				var min = time.min <= 9 ? '0' + time.min : time.min;
				var sec = time.sec <= 9 ? '0' + time.sec : time.sec;
				
				var t = hour + ':' + min + ':' + sec;
				// 화면에 표시
				Ext.fly(el).update(t);
			};

			// equivalent using TaskMgr
			Ext.TaskMgr.start({
				run: task,
				interval: 1000
			});
		},
		stop: function() { // 타이머 중지
			Ext.TaskMgr.stopAll();
		},
		get: function() { // 타이머 값(string)
			var el = this.getEl();

			var s = el.dom.outerText;
			if(s == undefined) {
				s = el.dom.innerText;
			}
			if(s == undefined) {
				s = el.dom.innerHTML;
			}
			
			return s;
		},
		reset: function() { // 리셋
			this.stop();
			this.start();
		},
		remove: function() { // 시간 표시 지우기
			this.stop();
			var el = this.getEl().update('');
		},
		set: function(cost) {
			if(cost == undefined) {
				cost = '0:00:00';
			}
			var el = this.getEl();
			el.update(cost);
		}
	},
	/**
	 * 문자열을 배열로 만들어준다.
	 * '123' -> [0]=1,[1]=2,[2]=3
	 * @param s
	 * @returns {Array}
	 */
	stringToArray: function(s) {
		if(s == undefined) {
			s = '';
		}
		
		var a = [];
		for(var i=0 ; i < s.length ; i++) {
			a[a.length] = parseInt(s.charAt(i));
		}
		
		return a;
	},
	getBlock: function(idx) {
		return this.items.get(idx);
	}

});

Ext.reg('sudoku-grid', Ext.sudoku.Grid);