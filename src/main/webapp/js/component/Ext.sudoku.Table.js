Ext.ns('Ext.sudoku.Grid');

Ext.sudoku.Table = Ext.extend(Ext.grid.GridPanel, {
	config: {
    	paging: {
    		start: 0,
    		limit: 20
    	}
	},
	id: 'sudoku-table',
	loadMask: true,
	initComponent: function() {
		var gp = this; // grid panel
		var store; // store
		var sm; // selection model
		var cm; // column model
		var bbar; // bottom tool bar
		
		// json store
		store = new Ext.data.JsonStore({
			url: 'grid/list.do',
			successProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total',
			root: 'data',
			fields: ['seq', 'cost', 'created'],
			remoteSort: true
		});
		
		this.on('rowdblclick', function(grid, rowIndex, evt) {
			var seq = grid.getStore().getAt(rowIndex).data.seq;
			
			new Ext.sudoku.Grid({
				parent: this.ownerCt,
				seq: seq
			});
		}, this);
		
		// create selection model
		sm = new Ext.grid.RowSelectionModel({
			singleSelect: true,
			listeners: {
				rowselect: function(sm, rowIndex, r) {
					var g = Ext.getCmp('sudoku-rank');
					if(g) {
						g.getStore().load({
							params: {
								seq: r.data.seq
							}
						});
					}
				}
			}
		});
		
		// create column model
		cm = new Ext.grid.ColumnModel({
			defaults: {
				sortable: true
			},
			columns: [{
				id: 'seq',
				header: '번호',
				width: 50,
				sortable: false,
				renderer: function(value, metaData, record, rowIndex, colIndex, store) {
					var total = store.getTotalCount();
					var p = store.lastOptions.params;
					return total - (((p.start / p.limit) * p.limit) + rowIndex);
				}
			}, {
				id: 'cost',
				header: '기록',
				dataIndex: 'cost',
				width: 70
			}, {
				id: 'created',
				header: '등록일',
				dataIndex: 'created'
			}]
		});
	
		this.autoExpandColumn = 'created';
			
		// bottom paging tool bar
		bbar = new Ext.PagingToolbar({
	        store: store,
	        displayInfo: true,
	        pageSize: this.config.paging.limit,
	        prependButtons: false,
	        plugins: new Ext.ux.SlidingPager(),
	        // displayInfo: false,
	        items: ['-', {
				ref: 'addBtn',
				tooltip: '스도쿠 등록',
				iconCls: 'sudoku-btn-add',
				scope: this,
				handler: function() {
					new Ext.sudoku.Grid({
						parent: this.ownerCt
					});
				}					
			}],
			listeners: {
				beforerender: function() {
					this.first.setVisible(false);
					this.prev.setVisible(false);
					this.next.setVisible(false);
					this.last.setVisible(false);
				}
			}
	    });
						
		this.store = store;
		this.sm = sm;
		this.cm = cm;
		this.bbar = bbar;
				
		Ext.sudoku.Table.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function() {
			this.store.load({
				params: {
					start: this.config.paging.start,
					limit: this.config.paging.limit
				}
			});
		}
	}
});

Ext.reg('sudoku-table', Ext.sudoku.Table);