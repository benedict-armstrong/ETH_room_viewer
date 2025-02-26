<script lang="ts">
  import { formatBooking } from '$lib/utils/dateUtils';

  export let booking: {
    eventName: string;
    start: Date;
    end: Date;
  };
  export let isCurrent = false;
</script>

<div class="mt-2 text-sm {isCurrent ? 'text-red-700' : 'text-green-700'}">
  <p class="font-medium">{isCurrent ? '' : 'Next: '}{booking.eventName}</p>
  <p>{formatBooking(booking.start, booking.end)}</p>
</div>