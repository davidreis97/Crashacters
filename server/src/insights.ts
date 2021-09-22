import * as appInsights from 'applicationinsights';

export enum Metric { PROCESSING_TIME = "processing_time" };

export class Insights{
	maxPushPerSecond = 1;
	pushedLastSecond = 0;
	client: appInsights.TelemetryClient;

	private static instance: Insights;
	static getInstance = () : Insights => this.instance ?? (this.instance = new Insights());

	private constructor(){
		setInterval(() => {
			this.pushedLastSecond = 0;
		}, 1000);

		appInsights.setup("fadd4644-263c-4932-a04c-28c146ee7a3a")
				   .start();
		this.client = appInsights.defaultClient;
	}

	pushMetric(metric: Metric, value: number){
		if (this.pushedLastSecond > this.maxPushPerSecond) return;

		this.client.trackMetric({name: metric, value});
		this.pushedLastSecond++;
	}

	reportCrash(exception: Error){
		this.client.trackException({exception});
	}

	dispose(){
		appInsights.defaultClient.flush()
		appInsights.dispose()
	}
}

