<template>
	<!-- Table header -->

	<thead v-if="mappedNodes.nodes.length">
		<tr class="--txtAlign" :class="`--txtSize-${size}`">
			<!-- TODO: define filters, filter table contents -->
			<th
				v-if="mappedNodes.nodes.length > 1 || withDefaultSlot"
				class="--sticky"
				:class="{ ['is--selected']: sort && !!ordering['id'] }"
				data-column-name="id"
				data-column="id"
			>
				<div class="flx --flxRow --flx-start-center --gap-10">
					<InputToggle
						v-if="!isReadOnly"
						:id="tableId + 'select-all'"
						:theme="theme || themeValues"
						:title="t('table_select_all')"
						:checked="selectedNodesCount === mappedNodes.nodes.length"
						:size="size"
						@update:model-value="toggleAll"
					/>
					<span v-if="!sort">#</span>
					<ActionLink
						v-else
						:theme="theme || themeValues"
						title="id"
						:tooltip="t('table_sort_by_name', { name: 'Id' })"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
						@click="() => setOrdering('id')"
					>
						<span>#</span>
						<template v-if="!!ordering['id']">
							<IconFa v-if="ordering['id'] === 'asc'" name="arrow-down" />
							<IconFa v-else name="arrow-up" />
						</template>
					</ActionLink>
				</div>
			</th>
			<template v-for="(meta, metaIndex) in propertiesMeta" :key="metaIndex">
				<td
					v-if="!meta.hidden"
					class="--maxWidth-440"
					:class="[
						`--txtSize-${size}`,
						{ ['is--selected']: meta.canSort && !!ordering[meta.value] },
					]"
					:data-column-name="meta.value"
					:data-column="meta.alias"
					:width="nested && metaIndex === propertiesMeta.length - 1 ? '99%' : 'auto'"
				>
					<span v-if="!meta.canSort" :title="meta.value">
						{{ meta.alias }}
					</span>
					<ActionLink
						v-else
						:theme="theme || themeValues"
						:title="meta.value"
						:tooltip="t('table_sort_by_name', { name: meta.alias })"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
						@click="() => setOrdering(meta.value)"
					>
						<span>{{ meta.alias }}</span>
						<template v-if="!!ordering[meta.value]">
							<IconFa v-if="ordering[meta.value] === 'asc'" name="arrow-down" />
							<IconFa v-else name="arrow-up" />
						</template>
					</ActionLink>
				</td>
			</template>
			<th
				v-if="!isReadOnly && (!!updateNode || !!deleteNode || !!cloneNode)"
				class="--sticky --txtAlign-center"
				data-column-name="modify"
				data-column="modify"
			>
				<span>
					{{ t("table_modify") }}
				</span>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import InputToggle from "../input/Toggle.vue";

	import type { iTableChildProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	export interface iTableHeadProps<
		Ti extends Record<string, any>,
		TMi extends Record<string, any> = Ti,
	> extends iTableChildProps<Ti, TMi> {
		withDefaultSlot: boolean;
	}

	/**
	 * Table head content
	 *
	 * @component
	 */

	defineOptions({ name: "TableHeadContent", inheritAttrs: false });

	const props = defineProps<iTableHeadProps<T, TM>>();

	const { t } = useHelpers(useI18n);
	const { themeValues } = useTheme(props);
</script>
