(function($){
  
  'use strict';
  
  var config
    , fields = {}
    , fieldTypes
    , fieldKeys = []
    , validatorTypes
    , validatorKeys = []
    , _id = 0
  
  $(document).on('acf/setup_fields', function(e, container){
    if( !fieldKeys.length ) setupFieldConfig();
    $('.acf-form-field').each(function(){
      var $el = $(this);
      if( $el.parentsUntil('.repeater', '.row-clone').length ) return;
      if( !$el.data('field-id') ) (function( $el ){
        var field = new Field( $el );
        fields[field.id] = field;
      })( $el );
    });
  });
  
  $(document).on('submit', '#post', function(e){
    for( var i in fields ) if( fields.hasOwnProperty(i) ){
      fields[i].sync();
    }
  });
  
  $(function(){
    if( !acf.fields.repeater ) return;
    var remove = acf.fields.repeater.remove;
    acf.fields.repeater.remove = function( $tr ){
      var $el = $tr.find('.acf-form-field');
      if( $el.length ){
        // find the field
        var id = $el.data('field-id');
        if( fields[id] ){
          fields[id].destroy();
        }
      }
      return remove.call( acf.fields.repeater, $tr );
    }
  });
  
  function Field( $el ){
    this.id = ++_id;
    this.$el = $el;
    this.$el.data('field-id', this.id);
    this.$input = $el.find('.form-field-value');
    this.$inputReal = $el.find('.form-field-value-real');
    this.$ui = $el.find('.acf-form-field-ui');
    this.$display = $el.find('.acf-form-field-display');
    
    this.$extra = $el.find('.extra-fields');
    this.$extraTable = this.$extra.find('>table');
    
    this.$validators = $el.find('.validate-fields');
    this.$validatorsTable = this.$validators.find('>table>tbody');
    
    this.$requiredMessageTable = $el.find('.required-message-table');
    
    this.$validatorSelect = $el.find('[data-name="validator-select"]');
    
    // inputs
    this.$type = this.$ui.find('[data-name="type"]');
    this.$label = this.$ui.find('[data-name="label"]');
    this.$name = this.$ui.find('[data-name="name"]');
    this.$description = this.$ui.find('[data-name="description"]');
    this.$classes = this.$ui.find('[data-name="classes"]');
    this.$required = this.$ui.find('[data-name="required"]');
    this.$requiredMessage = this.$ui.find('[data-name="required-message"]');
    
    this.init();
    this.events();
    
    this.updateForm();
    
    this.displayForm( !this.$input.val() );
    
    this.$el.trigger('field-change', ['add', this]);
  }
  
  $.extend( Field.prototype, {
    
    init : function(){
      var self = this;
      
      this.$inputReal.val('acf-form-field-'+this.id);
      this.$input.attr('name', 'acf-form-field-'+this.id);
      
      // add the types
      $.each(fieldKeys, function(i, key){
        var $option = $('<option />').val( key ).html( fieldTypes[key].label );
        self.$type.append( $option );
      });
      
      $.each(validatorKeys, function(i, key){
        var label = validatorTypes[key].label || key;
        var $option = $('<option />').val( key ).html( label );
        self.$validatorSelect.append( $option );
      });
      
      /*
      this.$validatorsTable.sortable({
        helper: acf.helpers.sortable
      });
      */
      
      if( this.$input.val() ){
        this.update();
      }
    },
    
    events : function(){
      this.on('change.acf-form-field', '[data-name="type"]', this.onTypeChange);
      this.on('click.acf-form-field', '[data-toggle="form"]', this.closeForm );
      this.on('click.acf-form-field', '.acf-form-field-display', this.openForm );
      this.on('change.acf-form-field', '[data-name="required"]', this.onRequiredChange );
      this.on('change.acf-form-field', '[data-name="validator-select"]', this.addValidatorEvent );
      
      var self = this;
      $(document).on('field-change.acf-form-field', function(e){
        self.onFieldsChange(e);
      });
    },
    
    on : function( event, selector, fn ){
      var self = this;
      if( fn ) this.$el.on(event+'.acf-form-field', selector, function(){
        return fn.apply(self, arguments);
      });
      else{
        fn = selector;
        this.$el.on(event, function(){
          return fn.apply(self, arguments);
        });
      }
    },
    
    addValidatorEvent : function(){
      var type = this.$validatorSelect.find('option:selected').val();
      this.$validatorSelect.find('option:selected').attr('selected', false);
      
      this.addValidator( type );
    },
    
    addValidator : function( type, val ){
      var cfg = validatorTypes[type];
      var $tr = $('<tr />').attr('data-type', type);
      var $th = $('<th />').html(cfg.label).appendTo($tr);
      var $td = $('<td />').appendTo($tr);
      
      var $removeContainer = $('<div />').appendTo($th);
      var $remove = $('<a href="#">Remove</a>').appendTo($removeContainer);
      
      var self = this;
      $remove.on('click', function(e){
        e.preventDefault();
        $tr.remove();
        if( !self.$validatorsTable.find('tr').length ) {
          self.$validators.hide();
        }
      });
      
      $tr.appendTo( this.$validatorsTable );
      
      var id, i, arg, $input;
      
      for( i in cfg.messages ) if( cfg.messages.hasOwnProperty(i) ) {
        id = 'validator_message_'+(++_id);
        $('<label />')
          .attr('for', id )
          .html('<em>Message</em> '+i)
          .appendTo( $td );
          
        $('<input type="text" />')
          .attr('data-validator-type', 'message')
          .attr('data-name', i)
          .attr('id', id)
          .addClass('control')
          .val(cfg.messages[i])
          .appendTo( $td )
      }
      
      if( cfg.args ) for( i in cfg.args ) if( cfg.args.hasOwnProperty(i) ) {
        arg = cfg.args[i];
        id = 'validator_arg_'+(++_id);
        $('<label />')
          .attr('for', id )
          .html('<em>Argument</em> '+arg.label)
          .appendTo( $td );
        
        $input = createInput( arg ).appendTo( $td );
        $input.attr('data-validator-type', 'arg');
        $input.attr('data-name', i);
        $input.attr('id', id);
      }
      
      this.$validators.show();
      return $tr;
    },
    
    destroy : function(){
      this.$el.off('.acf-form-field');
      $(document).off('field-change.acf-form-field', this.onFieldsChange);
      this.$el.trigger('field-change', ['remove', this]);
    },
    
    onTypeChange : function(e){
      this.updateForm();
    },
    
    onRequiredChange : function(){
      this.$requiredMessageTable[this.$required.is(':checked')?'show':'hide']();
    },
    
    onFieldsChange : function(e){
      var $f = this.$el.find('[data-type="form-field"]');
      if( !$f.length ) return;
      
      // update with all known fields
      $f.empty();
      $.each(fields, function(i, field){
        $f.append($('<option />').val(field.$name.val()).html(field.$label.val()));
      });
    },
    
    getType : function(){
      return this.$type.find('option:selected').val();
    },
    
    updateDisplay : function(){
      var val = this.getValueFromForm()
        , type = fieldTypes[val.type].label
        , required
        
      required = val.required ? ' <sup style="color: red;">*</sup>' : '';
      this.$display.html(
        '<span class="label type">'+type+'</span>'+
        '<strong>'+val.label+'</strong>'+
        required
      );
    },
    
    updateForm : function(){
      // get the config...
      var cfg = fieldTypes[this.getType()]
        , val = this.getValueFromInput()
        , i, j
      
      this.$extraTable.empty();
      this.$validatorsTable.empty();
      
      if( cfg.extra ){
        for( i in cfg.extra ) if( cfg.extra.hasOwnProperty(i) ){
          this.createFieldRow( i, cfg.extra[i], val && val.extra ? val.extra[i] : (cfg.extra[i].default||'') )
            .appendTo( this.$extraTable );
        }
        this.$extra.show();
      }
      else {
        this.$extra.hide();
      }
      
      // okay, now for the validators section....
      if( val.validators && val.validators.length ){
        for( i=0; i<val.validators.length; i++ ){
          var vcfg = val.validators[i];
          var $validator = this.addValidator( vcfg.type );
          // set the values...
          
          for( j in vcfg.message ) if( vcfg.message.hasOwnProperty(j) ) {
            setValue(
              $validator.find('[data-validator-type="message"][data-name="'+j+'"]'),
              vcfg.message[j]
            );
          }
          for( j in vcfg.arg ) if( vcfg.arg.hasOwnProperty(j) ) {
            setValue(
              $validator.find('[data-validator-type="arg"][data-name="'+j+'"]'),
              vcfg.arg[j]
            );
          }
        }
        this.$validators.show();
      }
      else {
        this.$validators.hide();
      }
      
    },
    
    getValueFromForm : function(){
      // go through all our fields
      var val = {
        type: this.getType(),
        name: this.$name.val(),
        label : this.$label.val(),
        description: this.$description.val(),
        classes: this.$classes.val(),
        required: this.$required.is(':checked'),
        requiredMessage : this.$requiredMessage.val(),
        extra : this.getTableValues( this.$extraTable )
        //validate : this.getTableValues( this.$validateTable )
      };
      
      // get our validators...
      var validators = [];
      this.$validatorsTable.find('tr').each(function(){
        var cfg = {message:{}, arg:{}};
        cfg.type = $(this).data('type');
        cfg.classname = validatorTypes[cfg.type].classname;
        $(this).find('[data-validator-type="message"]').each(function(){
          cfg.message[$(this).data('name')] = $(this).val();
        });
        $(this).find('[data-validator-type="arg"]').each(function(){
          cfg.arg[$(this).data('name')] = $(this).val();
        });
        validators.push(cfg);
      });
      
      val.validators = validators;
      return val;
    },
    
    getValueFromInput : function(){
      return this.$input.val() ? JSON.parse( this.$input.val() ) : {};
    },
    
    update : function(){
      var val = this.getValueFromInput();
      this.$type.find('option[value="'+val.type+'"]').attr('selected', 'selected');
      this.$label.val( val.label );
      this.$name.val( val.name );
      this.$description.val( val.description );
      this.$classes.val( val.classes );
      if( val.required ) this.$required.attr('checked', 'checked');
      this.$requiredMessage.val( val.requiredMessage );
      this.onRequiredChange();
    },
    
    sync : function(){
      this.$input.val( JSON.stringify(this.getValueFromForm()) );
    },
    
    createFieldRow : function( name, fld, val ){
      
      var $tr = $('<tr valign="top"/>');
      var $th = $('<th />').html( '<label>'+fld.label+'</label>' ).appendTo( $tr );
      var $td = $('<td />').appendTo( $tr );
      var $input = createInput( fld, val );
      
      $input.attr('data-name', name);
      if( fld['class'] ){
        $input.attr('class', fld['class']);
      }
      var id = 'acf-field-'+(++_id);
      $input.attr('id', id);
      $th.find('label').attr('for', id);
      $input.appendTo( $td );
      if( fld.description ){
        $('<div class="description" />').html( fld.description ).appendTo( $td );
      }
      if( fld.cls ){
        $input.addClass( fld.cls );
      }
      return $tr;
    },
    
    closeForm : function(){
      this.sync();
      this.displayForm( false );
    },
    
    openForm : function(){
      this.displayForm( true );
    },
    
    displayForm : function( show ){
      if( show ){
        this.$ui.show();
        this.$display.hide();
      }
      else {
        this.$ui.hide();
        this.updateDisplay();
        this.$display.show();
      }
    },
    
    getTableValues : function( $table ){
      var values = {};
      
      $table.find('input,textarea').each(function(){
        values[$(this).attr('data-name')] = $(this).val();
      });
      $table.find('select').each(function(){
        values[$(this).attr('data-name')] = $(this).find('option:selected').val();
      });
      
      return values;
    }
    
  });
  
  function createInput( def, val ) {
    var $input;
    switch( def.input ){
      case 'select':
        $input = $('<select />');
        // check for options
        if( def.options ){
          var is_array = $.type( def.options ) == 'array';
          $.each( def.options, function(i, o){
            var $option = $('<option />');
            $option.html(o);
            $option.val(!is_array?i:o);
            $option.appendTo( $input );
          });
        }
        break;
      
      case 'field':
        $input = $('<input type="text" placeholder="Field name" />');
        break;
        
      case 'textarea':
        $input = $('<textarea />');
        break;
      
      case 'text':
      default:
        $input = $('<input type="text" />');
    }
    if( val ) setValue( $input, val);
    return $input;
  }
  
  function setValue($el, value) {
    if( $el.is('input,textarea') ) $el.val( value );
    else if( $el.is('select') ){
      $el.find('option[value="'+value+'"]').attr('selected', 'selected');
    }
  }
  
  
  function setupFieldConfig(){
    fieldTypes = acf_field_form_field.fields;
    
    for( var i in fieldTypes ) if( fieldTypes.hasOwnProperty(i) ){
      fieldKeys.push(i);
    }
    if( fieldTypes['text']){
      fieldKeys.splice(fieldKeys.indexOf('text'),1);
      fieldKeys.unshift('text');
    }
    
    validatorTypes = acf_field_form_field.field_validators;
    for( var i in validatorTypes ) if( validatorTypes.hasOwnProperty(i) ){
      // this will automatically be added...
      if( i !== 'required'){
        validatorKeys.push(i);
      }
    }
  }
  
})(jQuery);