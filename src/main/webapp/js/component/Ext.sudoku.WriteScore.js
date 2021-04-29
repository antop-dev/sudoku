Ext.ns('Ext.sudoku.WriteScore');

Ext.sudoku.WriteScore = Ext.extend(Ext.FormPanel, {
	id: 'sudoku-write-score',
	floating: true,
	shadow: false,
	title: '기록 등록',
	padding: 10,
	labelWidth: 50,
	autoHeight: true,
	initComponent: function() {
		var el = this.parent.getEl();
				
		this.renderTo = el;
		
		this.width = el.getWidth() / 1.7;
		this.height = el.getHeight() / 3;
		this.x = (el.getWidth() - this.width) / 2;
		this.y = (el.getHeight() - this.height) /2;
		
		this.tools = [{
			id: 'close',
			scope: this,
			handler: function(e, el, p) {
				this.close();
			}
		}];
		
		this.items = [{
			xtype: 'hidden',
			name: 'seq',
			value: this.seq
		}, {
			xtype: 'displayfield',
			fieldLabel: '기록',
			value: this.cost
		}, {
			xtype: 'hidden',
			name: 'cost',
			value: this.cost
		}, {
			name: 'name',
			xtype: 'textfield',
			fieldLabel: '이름'
		}];
		
		this.bbar = ['->', {
			text: '등록',
			iconCls: 'sudoku-btn-save',
			scope: this,
			handler: this.regist
		}];
		
		Ext.sudoku.WriteScore.superclass.initComponent.call(this);
		
		this.parent.body.mask();
		this.parent.getTopToolbar().getEl().mask();
	},
	regist: function() {
		this.getForm().on('actioncomplete', function() {
			this.parent.getTopToolbar().getEl().unmask();
			this.parent.body.unmask();
			this.destroy();
		}, this);
		
		this.getForm().submit({
			scope: this,
			url: 'score/regist.do',
			success: function(form, action) {
				this.parent.status(action.result.rank + '위로 기록이 등록되었습니다.', 'x-status-valid');
			},
			failure: function(form, action) {
				var msg;
				
				switch (action.failureType) {
		            case Ext.form.Action.CONNECT_FAILURE:
		            	msg = '비동기 통신에 실패하였습니다.';
		                break;
		            case Ext.form.Action.SERVER_INVALID:
		            	msg = '서버 에러입니다. 관리자에게 문의하세요.';
		            	
		            	if(Ext.debug) 
		            		Ext.log('error: ' + action.result.msg);
		            	
		            	break;
		            default:
		            	msg = '알 수 없는 에러입니다.';
				}
				
				this.parent.status(msg, 'x-status-error');
				btn.setDisabled(false);
			}
		});	
	},
	close: function() {
		this.destroy();
	},
	listeners: {
		afterlayout: function() {
			var fields = this.find('name', 'name');
						
			if(fields.length == 1) {
				fields[0].focus(false, 500);
			}
		}
	}
});