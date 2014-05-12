<?php
/*
Plugin Name: Advanced Custom Fields: Snap Form Field
Plugin URI: https://github.com/soderlind/acf-field-date-time-picker
Description: Snap Form Field field for Advanced Custom Fields
Version: 1.0
Author: Mark Fabrizio
Author URI: http://owlwatch.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

add_action('acf/register_fields', 'register_acf_field_form_field');
function register_acf_field_form_field()
{
  require_once( dirname(__FILE__).'/acf-form-field.php');
  new acf_field_form_field();
}
