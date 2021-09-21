import appInsights from 'applicationinsights';

const maxPushPerSecond = 1;
let pushedLastSecond = 0;

setInterval(() => {
	pushedLastSecond = 0;
}, 1000);

appInsights.setup("fadd4644-263c-4932-a04c-28c146ee7a3a").start();
let client = appInsights.defaultClient;

export enum Metric { PROCESSING_TIME = "processing_time" };

export function pushMetric(metric: Metric, value: number){
	if (pushedLastSecond > maxPushPerSecond) return;

	client.trackMetric({name: metric, value});
	pushedLastSecond++;
}

export function reportCrash(exception: Error){
	client.trackException({exception});
}