<script lang="ts">
    import { Header } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { omu } from './client.js';

    if (BROWSER) {
        omu.start();
    }
</script>

<Header title="わんコメテンプレート同期" icon="ti-dog"></Header>
