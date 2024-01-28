import { useForm } from "@open-xamu-co/ui-common-helpers";

/**
 * xamu form composable
 */
export function useFormInput() {
	const { xamu } = useAppConfig();

	return useForm(xamu);
}
