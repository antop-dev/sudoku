Ext.ns('Ext.sudoku.Grid');

Ext.sudoku.Rank = Ext.extend(Ext.grid.GridPanel, {
	id: 'sudoku-rank',
	viewConfig: {
        forceFit: true
    },
	initComponent: function() {
		var table = this;

		// store
		var store = new Ext.data.JsonStore({
			url: 'score/list.do',
			successProperty: 'success',
			messageProperty: 'msg',
			root: 'data',
			fields: ['seq', 'name', 'cost']
		});
		this.store = store;
						
		// columns
		this.cm = new Ext.grid.ColumnModel({
			defaults: {
				align: 'left'
			},
			columns: [new Ext.grid.RowNumberer(), {
				header: '이름',
				dataIndex: 'name'
			}, {
				header: '시간',
				dataIndex: 'cost'
			}]
		});
		
		// selection model
		var sm = new Ext.grid.RowSelectionModel({
			singleSelect: true
		});
		this.sm = sm;
		
		this.bbar = new Ext.Toolbar({
			items: ['->', {
				ref: 'helpBtn',
				tooltip: 'about...',
				iconCls: 'sudoku-btn-help',
				scope: this,
				handler: this.methods.about
			}]
		});
		 
		Ext.sudoku.Rank.superclass.initComponent.call(this);
	},
	methods: {
		about: function() {
			var html = '<a href="http://antop.tistory.com" target="_blank">http://antop.tistory.com</a>' + '<br/>';
			html += '<a href="mailto:antop@naver.com">antop@naver.com</a>';
			
			Ext.MessageBox.show({
				title: 'About...',
				msg: html,
				icon: 'sudoku-mb-icon',
				buttons: Ext.MessageBox.OK
			});
		}
	}
});

Ext.reg('sudoku-rank', Ext.sudoku.Rank);