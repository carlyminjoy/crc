<template>
    <li>
        <i class='fa' :class="{ 'fa-check' : good, 'fa-exclamation-circle' : !good }"></i>
        <p> {{ section.answer }} <br>
            <strong>
                <span v-if='section.bmi'><br>Your BMI is: {{ section.bmi }}.<br><br></span>
                <span v-if='!good' v-html='section.recommendation'>
            </strong>
        </p>
    </li>
</template>

<script>

export default {
    name: 'feedback',
    props: ['section', 'good']
}

</script>