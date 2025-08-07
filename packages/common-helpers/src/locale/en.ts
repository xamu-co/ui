import omit from "lodash-es/omit";

import type {
	tLocaleBase,
	tLocaleForm,
	tLocaleInput,
	tLocaleModal,
	tLocalePagination,
	tLocaleTable,
	tPluginLocale,
} from "@open-xamu-co/ui-common-types";

/**
 * Base locale
 *
 * @locale en
 */
export const localeBase: tLocaleBase = {
	yes: "Yes",
	no: "No",
	increase: "increase",
	decrease: "Decrease",
	could_not_get_data: "Couldn't get the data",
	nothing_to_show: "Nothing to show",
	loading: "Loading...",
	close: "Close",
	ok: "Ok",
	see_value: "See value",
	see_name: 'See: "{name}"',
	add: "Add",
	clear: "Clear",
	required_verification: "* Required. The information provided will be verified.",
	previous: "Previous",
	next: "Next",
	send: "Send",
	delete: "Select to delete | Delete | Delete {count}",
	delete_all: "Delete all",
	pick: "Pick",
	refresh: "Refresh",
	render_error: "Couldn't render the contents due to an unknown error",
	swal: {
		cancel: "Cancel",
		continue: "Continue",
		error: "Error!",
		error_message: "Something went wrong!",
		connection_error: "Connection error!",
		connection_error_message:
			"The server is not responding. Please check your network or try again later",
		connection_error_confirm: "Retry",
		incomplete_data: "Incomplete data",
		incomplete_data_message: "Fill the data acorddinly",
		dont_close_window: "Don't close this window while we finish the task",
	},
};

/**
 * Input locale
 *
 * @locale en
 */
export const localeInput: tLocaleInput = {
	select_selected: "Selected",
	select_placeholder: "--SELECT--",
	select_restablish_field: "Restablish field",
	select_filter_options: "Type or Double click for options",
	file_one_of_amount: "{count} of {amount}",
	file_delete_files: "Delete file | Delete files",
	file_thumb: "Thumbnail",
	file_choose_file: "Choose a file | Choose files",
	file_or_drop_files_here: "Or drop it here | Or drop them here",
	file_max_file_size_mb: "maximum {size}MB per file",
	file_drop_files_here: "Drop file here | Drop files here",
	file_completed: "Completed",
	file_loading_files: "Loading file... | Loading files...",
	swal: {
		file_limit: "File limit",
		file_limit_text:
			"This field only allows {amount} file | This field only allows {amount} files",
		file_wrong_format_image: "Wrong format",
		file_wrong_format_image_text: "This field only allows image files",
		file_too_big: "File too big",
		file_too_big_text: "The file exceeds the allowed size",
		file_unknown_error: "Something went wrong",
		file_unknown_error_text: "There was an error uploding the files, try again later",
	},
};

/**
 * Modal locale
 *
 * @locale en
 */
export const localeModal: tLocaleModal = {
	modal_taking_too_long: "Taking too long?",
	swal: {
		modal_unauthorized: "Unauthorized",
		modal_unauthorized_text: "You are not allowed to perform this action",
	},
};

/**
 * Form locale
 *
 * @locale en
 */
export const localeForm: tLocaleForm = {
	form_required_options: "Options are required",
	form_requires_n_values:
		"No values are required | A value is required | {count} values are required",
	form_loading_countries: "Loading countries...",
	form_country: "Look for country",
	form_state: "Look for state",
	form_city: "Look for city",
	form_desired_password: "Desired password",
	form_confirm_password: "Confirm password",
	form_check_password: "Check password",
	form_password: "Password",
	form_email: "E-mail address",
	form_phone_line: "Phone line",
	form_cellphone: "Cellphone number",
	form_id_number: "ID number",
	form_complete_the_field: "Complete the field",
	form_location: "Location",
	form_invalid_field: "This field is invalid, fill it properly",
	form_required_field: "This field is required and can't be empty",
	form_use_valid_email: "You should use a valid E-mail address",
	form_use_valid_phone: "Too short. Use a valid phone number",
	form_use_valid_cellphone: "You should use a valid cellphone number",
	form_unmatching_passwords: "The passwords are unmatching",
	form_invalid_data: "Invalid data",
	form_no_values: "No values",
	form_new_value: "New value",
	// swal: {},
};

/**
 * Table locale
 *
 * @locale en
 */
export const localeTable: tLocaleTable = {
	table_see_values: "See {name}",
	table_see_name: 'See: "{name}"',
	table_hide_name: 'Hide: "{name}"',
	table_create_new: "Create new",
	table_create_new_name: 'Create new "{name}"',
	table_quantity: "Quantity: {count}",
	table_modify: "Modify",
	table_select: "Select",
	table_select_all: "Select all",
	table_update: "Update",
	table_update_name: 'Update: "{name}"',
	table_delete: "Delete",
	table_delete_name: 'Delete: "{name}"',
	table_showing_name: 'Showing: "{name}"',
	table_sort_by_name: 'Sort by: "{name}"',
	table_duplicate: "Duplicate",
	table_options: "Options",
	table_open_url: "Open URL",
	table_hide_all: "Hide all",
	table_show_all: "Show all",
	swal: {
		table_delete_node_title: "Are you sure you want to delete this item?",
		table_delete_node_disclaimer:
			"Remember that you wont be able to recover this item data and you will lost all of your work",
		table_deleted: "Successfull deletion",
		table_deleted_text: "The item was deleted, the list will refresh automatically",
		table_delete_nodes_title:
			"Are you sure you want to delete this item? | Are you sure you want to delete these {count} items?",
		table_delete_nodes_disclaimer:
			"Remember that you wont be able to recover these items data and you will lost all of your work",
		table_possibly_not_deleted: "Deletion went wrong",
		table_possibly_not_deleted_text:
			"The item may not have been deleted | The items may not have been deleted",
		table_updated: "Successfull update",
		table_updated_text: "The item was updated, the list will refresh automatically",
		table_possibly_not_updated: "Update went wrong",
		table_possibly_not_updated_text:
			"The item may not have been updated | The items may not have been updated",
		table_created: "Successfull creation",
		table_created_text: "The item was created, you can already find it in the list",
		table_possibly_not_created: "Creation went wrong",
		table_possibly_not_created_text:
			"The item may not have been created | The items may not have been created",
		table_cloned: "Successfull clonation",
		table_cloned_text: "The item was cloned, you can already find it in the list",
		table_possibly_not_cloned: "Clonation went wrong",
		table_possibly_not_cloned_text:
			"The item may not have been cloned | The items may not have been cloned",
	},
};

/**
 * Pagination locale
 *
 * @locale en
 */
export const localePagination: tLocalePagination = {
	pagination_items: "No items | Single item | {count} items",
	pagination_pages: "No pages | Single page | {count} pages",
	pagination_page: "Page {count} of",
	// swal: {},
};

/**
 * English locale
 *
 * @locale en
 */
const enLocale: tPluginLocale = {
	...omit(localeBase, "swal"),
	...omit(localeInput, "swal"),
	...omit(localeModal, "swal"),
	...omit(localeForm, "swal"),
	...omit(localeTable, "swal"),
	...omit(localePagination, "swal"),
	swal: {
		...localeBase.swal,
		...localeInput.swal,
		...localeModal.swal,
		// ...localeForm.swal,
		...localeTable.swal,
		// ...localePagination.swal,
	},
};

export default enLocale;
