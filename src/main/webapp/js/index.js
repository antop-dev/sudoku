// string trim
String.prototype.ltrim = function() {
	var re = /\s*((\S+\s*)*)/;
	return this.replace(re, "$1");
};

String.prototype.rtrim = function() {
	var re = /((\s*\S+)*)\s*/;
	return this.replace(re, "$1");
};

String.prototype.trim = function() {
	return this.ltrim().rtrim();
};

// document onload
Ext.onReady(function() {
    var el = Ext.get('loading-text');
	
    // use tooltip
	Ext.QuickTips.init();
	// blank image
	Ext.BLANK_IMAGE_URL = 'ext-3.3.1/images/default/s.gif';
	
	var body = new Ext.Panel({
		renderTo: Ext.getBody(),
		width: 900,
		height: 500,
		border: false,
		layout: {
			type: 'hbox',
            align: 'stretch',
            pack: 'start'
        },
		items: [{
			xtype: 'panel',
			title: '스도쿠',
			iconCls: 'sudoku-btn-grid',
			width: 500,
			layout: {
				type: 'hbox',
	            align: 'stretch',
	            pack: 'start'
	        },
	        defaults: {
	        	border: false
	        },
			items: [{
				flex: 1,
				xtype: 'sudoku-table',
				style: 'border-right-width: 1px;'
			}, {
				xtype: 'sudoku-rank',
				width: 200
			}]
		}, {
			flex: 1,
			title: '안내',
			xtype: 'panel',
			iconCls: 'sudoku-btn-help',
			padding: 10,
			autoScroll: true,
			autoLoad: 'help.html',
			border: false,
			style: {
				borderWidth: '1px 1px 1px 0'
			}
		}]
	});
	
	// 모든 초기화 처리 완료 후 1초 후에 로딩 화면 걷어내기
	var task = new Ext.util.DelayedTask(function() {
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove: true
		});
	});
	task.delay(1000);
	
	Ext.getBody().on({
		// 마우스 오른쪽 버튼 금지
		contextmenu: {
			fn: Ext.emptyFn,
			preventDefault: true
		}
	});
	/*
	var refresh = function() {
		var c = Ext.getCmp('sudoku-table');
		if(c) {
			c.getStore().reload();
		}
	};
		
	// 키보드로 새로고침 막기
    var keymap = new Ext.KeyMap(Ext.getBody().id, [{
        key: Ext.EventObject.F5,
        stopEvent: true,
        fn: refresh
    }, {
    	key: Ext.EventObject.R,
    	ctrl: true,
    	stopEvent: true,
        fn: refresh
    }]);
    keymap.enable();
    */
});