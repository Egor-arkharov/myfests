<template>
	<div v-for="f in fests" :key="f.id">
		<p>Fest: {{ f.name }}</p>
	</div>
</template>

<script>
export default {
	props: ["fests"],
};
</script>
