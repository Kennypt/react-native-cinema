/**
 * This Error extended allows us to do:
 * - define if we want to send the error message or not by using the prop 'expose';
 * - define a public message (prop 'publicMessage') besides the error message if we dont want to expose the error to the outside
 * - define the http status code with prop 'status'
 *
 * All this props will be handled by the error handler and manage it differently for dev and prod
 */
export default class CustomError extends Error {
  public readonly custom: boolean;

  public readonly expose: boolean;

  public readonly code: string | number;

  public readonly metricsCustomFields: object;

  public readonly props: {
    publicMessage?: string;
    status?: string;
    metricsCustomFields?: object;
  };

  public readonly publicMessage: string;

  public readonly status: string;

  constructor(message, code, props) {
    super(message);
    this.name = this.constructor.name;
    this.custom = true;
    this.metricsCustomFields = {};
    Error.captureStackTrace(this, this.constructor);

    this.expose = true; // By default, CustomErrors are exposed to the client, unless props contains { expose: false }.

    // Check if second parameter is 'code' or 'props'
    // since both are non mandatory
    switch (typeof code) {
      case 'string':
      case 'number':
        this.code = code;
        break;
      case 'object':
        // eslint-disable-next-line no-param-reassign
        props = code;
        break;
      case 'undefined':
      default:
        break;
    }

    if (typeof props === 'object') {
      Object.assign(this, props);

      if (this.props) {
        this.publicMessage = this.expose ? undefined : this.props.publicMessage; // In case we want to send a different message to the client
        this.status = this.props.status;
        this.metricsCustomFields = this.props.metricsCustomFields || {};
      }
    }
  }
}
