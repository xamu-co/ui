/**
 * Base locale
 *
 * @localeType
 */
export type tLocaleBase = {
	/** @example "Yes" */
	yes: string;
	/** @example "No" */
	no: string;
	/** @example "Increase" */
	increase: string;
	/** @example "Decrease" */
	decrease: string;
	/** @example "Couldn't get the data" */
	could_not_get_data: string;
	/** @example "Nothing to show" */
	nothing_to_show: string;
	/** @example "Loading..." */
	loading: string;
	/** @example "Close" */
	close: string;
	/** @example "Ok" */
	ok: string;
	/** @example "See value" */
	see_value: string;
	/** @example "See: \"{name}\"" */
	see_name: string;
	/** @example "Add" */
	add: string;
	/** @example "Clear" */
	clear: string;
	/** @example "* Required. The information provided will be verified." */
	required_verification: string;
	/** @example "Previous" */
	previous: string;
	/** @example "Next" */
	next: string;
	/** @example "Send" */
	send: string;
	/** @example "Select to delete | Delete | Delete {count}" */
	delete: string;
	/** @example "Delete all" */
	delete_all: string;
	/** @example "Pick" */
	pick: string;
	/** @example "Refresh" */
	refresh: string;
	/** @example "Couldn't render the contents due to an unknown error" */
	render_error: string;
	swal: {
		/** @example "Cancel" */
		cancel: string;
		/** @example "Continue" */
		continue: string;
		/** @example "Error!" */
		error: string;
		/** @example "Something went wrong!" */
		error_message: string;
		/** @example "Connection error!" */
		connection_error: string;
		/** @example "The server is not responding. Please check your network or try again later" */
		connection_error_message: string;
		/** @example "Retry" */
		connection_error_confirm: string;
		/** @example "Incomplete data" */
		incomplete_data: string;
		/** @example "Fill the data acorddinly" */
		incomplete_data_message: string;
		/** @example "Don't close this window while we finish the task" */
		dont_close_window: string;
	};
};

/**
 * Input locale
 *
 * @localeType
 */
export type tLocaleInput = {
	/** @example "Selected" */
	select_selected: string;
	/** @example "--SELECT--" */
	select_placeholder: string;
	/** @example "Restablish field" */
	select_restablish_field: string;
	/** @example "Type or Double click for options" */
	select_filter_options: string;
	/** @example "{count} of {amount}" */
	file_one_of_amount: string;
	/** @example "Delete file | Delete files" */
	file_delete_files: string;
	/** @example "Thumbnail" */
	file_thumb: string;
	/** @example "Choose a file | Choose files" */
	file_choose_file: string;
	/** @example "Or drop it here | Or drop them here" */
	file_or_drop_files_here: string;
	/** @example "maximum {size}MB per file" */
	file_max_file_size_mb: string;
	/** @example "Drop file here | Drop files here" */
	file_drop_files_here: string;
	/** @example "Completed" */
	file_completed: string;
	/** @example "Loading file... | Loading files..." */
	file_loading_files: string;
	swal: {
		/** @example "File limit" */
		file_limit: string;
		/** @example "This field only allows {amount} file | This field only allows {amount} files" */
		file_limit_text: string;
		/** @example "Wrong format" */
		file_wrong_format_image: string;
		/** @example "This field only allows image files" */
		file_wrong_format_image_text: string;
		/** @example "File too big" */
		file_too_big: string;
		/** @example "The file exceeds the allowed size" */
		file_too_big_text: string;
		/** @example "Something went wrong" */
		file_unknown_error: string;
		/** @example "There was an error uploding the files, try again later" */
		file_unknown_error_text: string;
	};
};

/**
 * Modal locale
 *
 * @localeType
 */
export type tLocaleModal = {
	/** @example "Taking too long?" */
	modal_taking_too_long: string;
	swal: {
		/** @example "Unauthorized" */
		modal_unauthorized: string;
		/** @example "You are not allowed to perform this action" */
		modal_unauthorized_text: string;
	};
};

/**
 * Form locale
 *
 * @localeType
 */
export type tLocaleForm = {
	/** @example "Options are required" */
	form_required_options: string;
	/** @example "No values are required | A value is required | {count} values are required" */
	form_requires_n_values: string;
	/** @example "Loading countries..." */
	form_loading_countries: string;
	/** @example "Look for country" */
	form_country: string;
	/** @example "Look for state" */
	form_state: string;
	/** @example "Look for city" */
	form_city: string;
	/** @example "Desired password" */
	form_desired_password: string;
	/** @example "Confirm password" */
	form_confirm_password: string;
	/** @example "Check password" */
	form_check_password: string;
	/** @example "Password" */
	form_password: string;
	/** @example "E-mail address" */
	form_email: string;
	/** @example "Phone line" */
	form_phone_line: string;
	/** @example "Cellphone number" */
	form_cellphone: string;
	/** @example "ID number" */
	form_id_number: string;
	/** @example "Complete the field" */
	form_complete_the_field: string;
	/** @example "Location" */
	form_location: string;
	/** @example "This field is invalid, fill it properly" */
	form_invalid_field: string;
	/** @example "This field is required and can't be empty" */
	form_required_field: string;
	/** @example "You should use a valid E-mail address" */
	form_use_valid_email: string;
	/** @example "Too short. Use a valid phone number" */
	form_use_valid_phone: string;
	/** @example "You should use a valid cellphone number" */
	form_use_valid_cellphone: string;
	/** @example "The passwords are unmatching" */
	form_unmatching_passwords: string;
	/** @example "Invalid data" */
	form_invalid_data: string;
	/** @example "No values" */
	form_no_values: string;
	/** @example "New value" */
	form_new_value: string;
	// swal: {};
};

/**
 * Table locale
 *
 * @localeType
 */
export type tLocaleTable = {
	/** @example "See {name}" */
	table_see_values: string;
	/** @example "See: \"{name}\"" */
	table_see_name: string;
	/** @example "Create new" */
	table_create_new: string;
	/** @example "Crear nuevo" */
	table_create_new_name: string;
	/** @example "Quantity: {count} */
	table_quantity: string;
	/** @example "Modify" */
	table_modify: string;
	/** @example "Select" */
	table_select: string;
	/** @example "Select all" */
	table_select_all: string;
	/** @example "Update" */
	table_update: string;
	/** @example "Update: \"{name}\"" */
	table_update_name: string;
	/** @example "Delete" */
	table_delete: string;
	/** @example "Delete: \"{name}\"" */
	table_delete_name: string;
	/** @example "Showing: \"{name}\"" */
	table_showing_name: string;
	/** @example "Sort by: \"{name}\"" */
	table_sort_by_name: string;
	/** @example "Duplicate" */
	table_duplicate: string;
	/** @example "Options" */
	table_options: string;
	/** @example "Open URL" */
	table_open_url: string;
	/** @example "Hide all" */
	table_hide_all: string;
	/** @example "Show all" */
	table_show_all: string;
	swal: {
		/** @example "Are you sure you want to delete this element?" */
		table_delete_node_title: string;
		/** @example "Remember that you wont be able to recover this element data and you will lost all of your work" */
		table_delete_node_disclaimer: string;
		/** @example "Successfull deletion" */
		table_deleted: string;
		/** @example "Are you sure you want to delete this element? | Are you sure you want to delete these {count} elements?" */
		table_delete_nodes_title: string;
		/** @example "Remember that you wont be able to recover these elements data and you will lost all of your work" */
		table_delete_nodes_disclaimer: string;
		/** @example "The item may not have been deleted | The items may not have been deleted" */
		table_possibly_not_deleted: string;
		/** @example "Successfull update" */
		table_updated: string;
		/** @example "The item may not have been updated | The items may not have been updated" */
		table_possibly_not_updated: string;
		/** @example "Successfull update" */
		table_created: string;
		/** @example "The item may not have been created | The items may not have been created" */
		table_possibly_not_created: string;
		/** @example "Successfull cloning" */
		table_cloned: string;
		/** @example "The item may not have been cloned | The items may not have been cloned" */
		table_possibly_not_cloned: string;
	};
};

/**
 * Pagination locale
 *
 * @localeType
 */
export type tLocalePagination = {
	/** @example "No items | Single item | {count} items" */
	pagination_items: string;
	/** @example "No pages | Single page | {count} pages" */
	pagination_pages: string;
	// swal: {};
};

/**
 * Plugin locale
 *
 * @localeType
 */
export type tPluginLocale = tLocaleBase &
	tLocaleInput &
	tLocaleModal &
	tLocaleForm &
	tLocaleTable &
	tLocalePagination;
