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
 * @locale es
 */
export const localeBase: tLocaleBase = {
	yes: "Si",
	no: "No",
	increase: "Aumentar",
	decrease: "Disminuir",
	could_not_get_data: "No se pudo obtener los datos",
	nothing_to_show: "Nada para mostrar",
	loading: "Cargando...",
	close: "Cerrar",
	ok: "Aceptar",
	see_value: "Ver valor",
	see_name: 'Ver "{name}"',
	add: "Añadir",
	clear: "Limpiar",
	required_verification: "* Requerido. La información proporcionada sera verificada.",
	previous: "Anterior",
	next: "Siguiente",
	send: "Enviar",
	delete: "Selecciona para eliminar | Eliminar | Eliminar {count}",
	delete_all: "Eliminar todo",
	pick: "Elegir",
	refresh: "Refrescar",
	render_error: "No pudimos renderizar los contenidos debido a un error desconocido",
	swal: {
		cancel: "Cancelar",
		continue: "Continuar",
		error: "¡Error!",
		error_message: "¡Algo salió mal!",
		connection_error: "¡Error de conexión!",
		connection_error_message:
			"El servidor no responde. Por favor verifica tu conexión o inténtalo de nuevo más tarde",
		connection_error_confirm: "Reintentar",
		incomplete_data: "Datos incompletos",
		incomplete_data_message: "Llena los datos adecuadamente",
		dont_close_window: "No cierres esta ventana mientras completamos el proceso",
	},
};

/**
 * Input locale
 *
 * @locale es
 */
export const localeInput: tLocaleInput = {
	select_selected: "Seleccionado",
	select_placeholder: "--SELECCIONAR--",
	select_restablish_field: "Restablecer campo",
	select_filter_options: "Escribe o haz doble click para las opciones",
	file_one_of_amount: "{count} de {amount}",
	file_delete_files: "Quitar archivo | Quitar archivos",
	file_thumb: "Miniatura",
	file_choose_file: "Elegir archivo | Elegir archivos",
	file_or_drop_files_here: "O arrástralo aquí | O arrástralos aquí",
	file_max_file_size_mb: "máximo {size}MB por archivo",
	file_drop_files_here: "Soltar archivo aquí | Soltar archivos aquí",
	file_completed: "Completado",
	file_loading_files: "Cargando archivo... | Cargando archivos...",
	swal: {
		file_limit: "Límite de archivos",
		file_limit_text:
			"Este campo solo permite {amount} archivo | Este campo solo permite {amount} archivos",
		file_wrong_format_image: "Formato incorrecto",
		file_wrong_format_image_text: "Este campo solo permite archivos de imagen",
		file_too_big: "Archivo demasiado grande",
		file_too_big_text: "El archivo supera el tamaño permitido",
		file_unknown_error: "Algo salió mal",
		file_unknown_error_text:
			"Ocurrió un error al subir el archivo, inténtalo nuevamente más tarde | Ocurrió un error al subir los archivos, inténtalo nuevamente más tarde",
	},
};

/**
 * Modal locale
 *
 * @locale es
 */
export const localeModal: tLocaleModal = {
	modal_taking_too_long: "¿Esta tardando demasiado?",
	swal: {
		modal_unauthorized: "No autorizado",
		modal_unauthorized_text: "No tienes permiso para realizar esta acción",
	},
};

/**
 * Form locale
 *
 * @locale es
 */
export const localeForm: tLocaleForm = {
	form_required_options: "Las opciones son requeridas",
	form_requires_n_values:
		"No se requieren valores | Se requiere un valor | {count} valores son requeridos",
	form_loading_countries: "Cargando países...",
	form_awaiting_countries: "Esperando datos de países...",
	form_country: "Buscar país",
	form_state: "Buscar provincia",
	form_city: "Buscar ciudad",
	form_desired_password: "Contraseña deseada",
	form_confirm_password: "Confirma la contraseña",
	form_check_password: "Verificar Contraseña",
	form_password: "Contraseña",
	form_email: "Dirección de correo",
	form_phone_line: "Linea de teléfono fijo",
	form_cellphone: "Teléfono celular",
	form_id_number: "Numero de identificación",
	form_complete_the_field: "Completa el campo",
	form_location: "Ubicación",
	form_invalid_field: "Este campo es invalido, complétalo adecuadamente",
	form_required_field: "Este campo es requerido y no puede estar vació",
	form_use_valid_email: "Debes usar una dirección de correo electrónico valida",
	form_use_valid_phone: "Muy corto. Usa un numero de teléfono valido",
	form_use_valid_cellphone: "Debes usar un numero de celular valido",
	form_unmatching_passwords: "Las contraseñas no coinciden",
	form_invalid_data: "Información invalida",
	form_no_values: "Sin valores",
	form_new_value: "Nuevo valor",
	// swal: {},
};

/**
 * Table locale
 *
 * @locale es
 */
export const localeTable: tLocaleTable = {
	table_see_values: "Ver {name}",
	table_see_name: 'Ver: "{name}"',
	table_hide_name: 'Ocultar: "{name}"',
	table_create_new: "Crear nuevo",
	table_create_new_name: 'Crear nuevo "{name}"',
	table_quantity: "Cantidad: {count}",
	table_modify: "Modificar",
	table_select: "Seleccionar",
	table_select_all: "Seleccionar todo",
	table_update: "Actualizar",
	table_update_name: 'Actualizar: "{name}"',
	table_delete: "Eliminar",
	table_delete_name: 'Eliminar: "{name}"',
	table_showing_name: 'Mostrando: "{name}"',
	table_sort_by_name: 'Ordenar por: "{name}"',
	table_duplicate: "Duplicar",
	table_options: "Opciones",
	table_open_url: "Abrir enlace",
	table_hide_all: "Ocultar todo",
	table_show_all: "Mostrar todo",
	swal: {
		table_delete_node_title: "¿Estas seguro de que quieres eliminar este elemento?",
		table_delete_node_disclaimer:
			"Recuerda que no podrás recuperar los datos de este elemento y perderás todo tu trabajo.",
		table_deleted: "Eliminación exitosa",
		table_deleted_text: "Se eliminó el elemento, la lista se refrescara automáticamente",
		table_delete_nodes_title:
			"¿Estas seguro de que quieres eliminar este elemento? | ¿Estas seguro de que quieres eliminar estos {count} elementos?",
		table_delete_nodes_disclaimer:
			"Recuerda que no podrás recuperar los datos de estos elementos y perderás todo tu trabajo.",
		table_possibly_not_deleted: "Eliminación fallida",
		table_possibly_not_deleted_text:
			"Puede que el elemento no haya sido eliminado | Puede que los elementos no hayan sido eliminados",
		table_updated: "Actualización exitosa",
		table_updated_text: "Se actualizó el elemento, la lista se refrescara automáticamente",
		table_possibly_not_updated: "Actualización fallida",
		table_possibly_not_updated_text:
			"Puede que el elemento no haya sido actualizado | Puede que los elementos no hayan sido actualizados",
		table_created: "Creación exitosa",
		table_created_text: "Se creó el elemento, ya puedes encontrarlo en la lista",
		table_possibly_not_created: "Creación fallida",
		table_possibly_not_created_text:
			"Puede que el elemento no haya sido creado | Puede que los elementos no hayan sido creados",
		table_cloned: "Clonación exitosa",
		table_cloned_text: "Se clonó el elemento, ya puedes encontrarlo en la lista",
		table_possibly_not_cloned: "Clonación fallida",
		table_possibly_not_cloned_text:
			"Puede que el elemento no haya sido clonado | Puede que los elementos no hayan sido clonados",
	},
};

/**
 * Pagination locale
 *
 * @locale es
 */
export const localePagination: tLocalePagination = {
	pagination_items: "Sin elementos | Único elemento | {count} elementos",
	pagination_pages: "Sin páginas | Única página | {count} páginas",
	pagination_page: "Página {count} de",
	// swal: {},
};

/**
 * Spanish locale
 *
 * @locale es
 */
const esLocale: tPluginLocale = {
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

export default esLocale;
