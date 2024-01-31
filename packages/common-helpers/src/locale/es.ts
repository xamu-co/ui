import _ from "lodash";

import type {
	iLocaleBase,
	iLocaleForm,
	iLocaleInput,
	iLocaleModal,
	iLocalePagination,
	iLocaleTable,
	tPluginLocale,
} from "@open-xamu-co/ui-common-types";

/**
 * Base locale
 *
 * @locale es
 */
export const localeBase: iLocaleBase = {
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
	required_verification: "* Requerido. La informacion proporcionada sera verificada.",
	previous: "Anterior",
	next: "Siguiente",
	send: "Enviar",
	delete: "Selecciona para eliminar | Eliminar | Eliminar {count}",
	delete_all: "Eliminar todo",
	pick: "Elegir",
	refresh: "Refrescar",
	swal: {
		cancel: "Cancelar",
		continue: "Continuar",
		connection_error: "¡Error de conexion!",
		connection_error_message:
			"El servidor no responde. Por favor verifica tu conexion o intentalo de nuevo mas tarde",
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
export const localeInput: iLocaleInput = {
	select_selected: "Seleccionado",
	select_placeholder: "--SELECCIONAR--",
	select_restablish_field: "Restablecer campo",
	select_filter_options: "Escribe o haz doble click para las opciones",
	file_one_of_amount: "{count} de {amount}",
	file_delete_files: "Eliminar archivo | Eliminar archivos",
	file_thumb: "Miniatura",
	file_choose_file: "Seleccionar un archivo | Seleccionar archivos",
	file_or_drop_files_here: "O arrástralo aquí | O arrástralos aquí",
	file_max_file_size_mb: "máximo {size}MB por archivo",
	file_drop_files_here: "Suelta el archivo aquí | Suelta los archivos aquí",
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
			"Ocurrió un error al subir los archivos, intenta nuevamente más tarde",
	},
};

/**
 * Modal locale
 *
 * @locale es
 */
export const localeModal: iLocaleModal = {
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
export const localeForm: iLocaleForm = {
	form_required_options: "Las opciones son requeridas",
	form_requires_n_values:
		"No se requieren valores | Se requiere un valor | {count} valores son requeridos",
	form_loading_countries: "Cargando paises...",
	form_country: "Buscar país",
	form_state: "Buscar provincia",
	form_city: "Buscar ciudad",
	form_desired_password: "Contraseña deseada",
	form_confirm_password: "Confirma la contraseña",
	form_check_password: "Verificar Contraseña",
	form_password: "Contraseña",
	form_email: "Direccion de correo",
	form_phone_line: "Linea de telefono fijo",
	form_cellphone: "Telefono celular",
	form_id_number: "Numero de identificacion",
	form_complete_the_field: "Completa el campo",
	form_location: "Ubicacion",
	form_invalid_field: "Este campo es invalido, completalo adecuadamente",
	form_required_field: "Este campo es requerido y no puede estar vacio",
	form_use_valid_email: "Debes usar una direccion de correo electronico valida",
	form_use_valid_phone: "Muy corto. Usa un numero de telefono valido",
	form_use_valid_cellphone: "Debes usar un numero de celular valido",
	form_unmatching_passwords: "Las contraseñas no coinciden",
	form_invalid_data: "Informacion invalida",
	// swal: {},
};

/**
 * Table locale
 *
 * @locale es
 */
export const localeTable: iLocaleTable = {
	table_see_values: "Ver {name}",
	table_see_name: 'Ver: "{name}"',
	table_create_new: "Crear nuevo",
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
	swal: {
		table_delete_node_title: "¿Estas seguro de que quieres eliminar este elemento?",
		table_delete_node_disclaimer:
			"Recuerda que no podras recuperar los datos de este elemento y perderas todo tu trabajo.",
		table_deleted: "Eliminacion exitosa",
		table_delete_nodes_title:
			"¿Estas seguro de que quieres eliminar este elemento? | ¿Estas seguro de que quieres eliminar estos {count} elementos?",
		table_delete_nodes_disclaimer:
			"Recuerda que no podras recuperar los datos de estos elementos y perderas todo tu trabajo.",
		table_possibly_not_deleted:
			"El elemento pudo no haber sido eliminado | Los elementos pudieron no haber sido eliminados",
		table_updated: "Actualizacion exitosa",
		table_possibly_not_updated:
			"El elemento pudo no haber sido actualizado | Los elementos pudieron no haber sido actualizados",
		table_created: "Creacion exitosa",
		table_possibly_not_created:
			"El elemento pudo no haber sido creado | Los elementos pudieron no haber sido creados",
		table_cloned: "Clonacion exitosa",
		table_possibly_not_cloned:
			"El elemento pudo no haber sido clonado | Los elementos pudieron no haber sido clonados",
	},
};

/**
 * Pagination locale
 *
 * @locale es
 */
export const localePagination: iLocalePagination = {
	pagination_items: "Sin elementos | Único elemento | {count} elementos",
	pagination_pages: "Sin páginas | Única página | {count} páginas",
	pagination_order_relevance: "Orden: relevancia",
	pagination_order_recent: "Orden: mas reciente",
	pagination_order_older: "Orden: mas antiguo",
	pagination_order_expensive: "Orden: menor precio",
	pagination_order_cheaper: "Orden: mayor precio",
	pagination_order_az: "Orden: alfabeticamente (Asc.)",
	pagination_order_za: "Orden: alfabeticamente (Desc.)",
	pagination_filter_by: "Filtrar por:",
	// swal: {},
};

/**
 * Spanish locale
 *
 * @locale es
 */
const esLocale: tPluginLocale = {
	..._.omit(localeBase, "swal"),
	..._.omit(localeInput, "swal"),
	..._.omit(localeModal, "swal"),
	..._.omit(localeForm, "swal"),
	..._.omit(localeTable, "swal"),
	..._.omit(localePagination, "swal"),
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
