<?php

if( !class_exists('acf_field') ) return;
class acf_field_form_field extends acf_field
{
  protected $domain;
  
  /*
	*  __construct
	*
	*  Set name / label needed for actions / filters
	*
	*  @since	3.6
	*  @date	23/01/13
	*/
	
	function __construct()
	{
		// vars
    $this->domain = 'acf_field_form_field';
		$this->name = 'form_field';
		$this->label = __('Form Field', $this->domain);
		// do not delete!
    parent::__construct();
	}
	
	/*
	*  load_value()
	*
	*  This filter is appied to the $value after it is loaded from the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value - the value found in the database
	*  @param	$post_id - the $post_id from which the value was loaded from
	*  @param	$field - the field array holding all the field options
	*
	*  @return	$value - the value to be saved in te database
	*/
	
	function load_value( $value, $post_id, $field )
	{
		return $value;
	}
	
	
	/*
	*  format_value()
	*
	*  This filter is appied to the $value after it is loaded from the db and before it is passed to the create_field action
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value	- the value which was loaded from the database
	*  @param	$post_id - the $post_id from which the value was loaded
	*  @param	$field	- the field array holding all the field options
	*
	*  @return	$value	- the modified value
	*/
	
	function format_value( $value, $post_id, $field )
	{
		return $value;
	}
	
	
	/*
	*  format_value_for_api()
	*
	*  This filter is appied to the $value after it is loaded from the db and before it is passed back to the api functions such as the_field
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value	- the value which was loaded from the database
	*  @param	$post_id - the $post_id from which the value was loaded
	*  @param	$field	- the field array holding all the field options
	*
	*  @return	$value	- the modified value
	*/
	
	function format_value_for_api( $value, $post_id, $field )
	{
		return $value;
	}
	
	function json_fix( $value, $post_id, $field )
	{
		return addslashes($value);
	}
	
	
	/*
	*  update_value()
	*
	*  This filter is appied to the $value before it is updated in the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value - the value which will be saved in the database
	*  @param	$field - the field array holding all the field options
	*  @param	$post_id - the $post_id of which the value will be saved
	*
	*  @return	$value - the modified value
	*/
	
	function update_value( $value, $post_id, $field )
	{
		// this sucks, but we kinda have to do it for now...
		$value = $_POST[$value];
		return $value;
	}
	
	
	/*
	*  load_field()
	*
	*  This filter is appied to the $field after it is loaded from the database
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field - the field array holding all the field options
	*
	*  @return	$field - the field array holding all the field options
	*/
	
	function load_field( $field )
	{
		return $field;
	}
	
	
	/*
	*  update_field()
	*
	*  This filter is appied to the $field before it is saved to the database
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field - the field array holding all the field options
	*  @param	$post_id - the field group ID (post_type = acf)
	*
	*  @return	$field - the modified field
	*/

	function update_field( $field, $post_id )
	{
		return $field;
	}
	
	
	/*
	*  create_field()
	*
	*  Create the HTML interface for your field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field - an array holding all the field's data
	*/
	
	function create_field( $field )
	{
    ?>
		<div class="acf-form-field">
			<input type="hidden"
				value=""
				name="<?= $field['name'] ?>"
				class="form-field-value-real"
				title="<?= esc_attr($field['label']) ?>" />
				
			<input
				type="hidden"
				value="<?= esc_attr($field['value']) ?>"
				class="form-field-value"
			/>
				
			<div class="acf-form-field-ui">
				<table class="primary-ui-fields">
					<thead>
						<tr>
							<th>Type</th>
							<th>Name</th>
							<th>Label</th>
							<th> </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<select data-name="type"></select>
							</td>
							<td>
								<input data-name="name" type="text"/>
							</td>
							<td>
								<input data-name="label" type="text"/>
							</td>
							<td>
								<label>
									<input data-name="required" type="checkbox" />
									Required
								</label>
							</td>
						</tr>
					</tbody>
				</table>
				
				<table class="required-message-table field-table">
					<tbody>
						<tr>
							<th>Required Message</th>
							<td><input type="text" data-name="required-message" value="This field is required" /></td>
						</tr>
					</tbody>
				</table>
				
				<table class="advanced-table field-table">
					<tbody>
						<tr>
							<th>Description</th>
							<td><input type="text" data-name="description" value="" /></td>
						</tr>
						<tr>
							<th>Classes</th>
							<td><input type="text" data-name="classes" value="" /></td>
						</tr>
					</tbody>
				</table>
				
				<div class="extra-fields">
					<table class="extra-fields-table field-table">
						
					</table>
				</div>
				<div class="validation">
					<select style="width: auto;" data-name="validator-select">
						<option value="">-Add Validator-</option>
					</select>
					<div class="validate-fields">
						<table class="validate-fields-table validator-table">
							<thead>
								<tr>
									<th>Validators</th>
									<th></th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
				<div class="button-container">
					<button type="button" class="button" data-toggle="form">Close Field</button>
				</div>
			</div>
			<div class="acf-form-field-display">
			
			</div>
		</div>
    <?php
	}
	
	
	/*
	*  create_options()
	*
	*  Create extra options for your field. This is rendered when editing a field.
	*  The value of $field['name'] can be used (like bellow) to save extra data to the $field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field	- an array holding all the field's data
	*/
	
	function create_options( $field )
	{
		
	}

	
	/*
	*  input_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
	*  Use this action to add css + javascript to assist your create_field() action.
	*
	*  $info	http://codex.wordpress.org/Plugin_API/Action_Reference/admin_enqueue_scripts
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*/

	function input_admin_enqueue_scripts()
	{
    wp_enqueue_script( 'acf-form-field', plugins_url('/assets/javascripts/form-field.js', __FILE__ ), array('acf-input') );
		wp_enqueue_style( 'acf-form-field', plugins_url('/assets/stylesheets/form-field.css', __FILE__ ) );
		
	}

	
	/*
	*  input_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is created.
	*  Use this action to add css and javascript to assist your create_field() action.
	*
	*  @info	http://codex.wordpress.org/Plugin_API/Action_Reference/admin_head
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*/

	function input_admin_head()
	{
		$this->fields = Snap::inst('Snap_Wordpress_Form2')->get_fields();
		
		?>
<script type="text/javascript">
var acf_field_form_field = {
	fields: <?= json_encode( Snap::inst('Snap_Wordpress_Form2')->get_fields() ) ?>,
	field_validators : <?= json_encode( Snap::inst('Snap_Wordpress_Form2')->get_field_validators() ) ?>
}
</script>
		<?php
	}
	
	
	/*
	*  field_group_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is edited.
	*  Use this action to add css + javascript to assist your create_field_options() action.
	*
	*  $info	http://codex.wordpress.org/Plugin_API/Action_Reference/admin_enqueue_scripts
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*/

	function field_group_admin_enqueue_scripts()
	{

	}

	
	/*
	*  field_group_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is edited.
	*  Use this action to add css and javascript to assist your create_field_options() action.
	*
	*  @info	http://codex.wordpress.org/Plugin_API/Action_Reference/admin_head
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*/

	function field_group_admin_head()
	{

	}
}
