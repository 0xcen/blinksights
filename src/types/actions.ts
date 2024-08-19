export interface Blink {
  label: string;
  title: string;
  description: string;
  links: {
    actions: Array<LinkedAction>;
  };
}

export interface BlinkWithOrg extends Blink {
  orgId: string;
  id: string;
  url: string;
  createdAt: string;
}

export interface LinkedAction {
  /** URL endpoint for an action */
  href: string;
  /** button text rendered to the user */
  label: string;
  /**
   * Parameters to accept user input within an action
   * @see {ActionParameter}
   * @see {ActionParameterSelectable}
   */
  parameters?: Array<ActionParameter>;
}

/** Parameter to accept user input within an action */
export interface ActionParameter {
  /** input field type */
  type?: ActionParameterType;
  /** parameter name in url */
  name: string;
  /** placeholder text for the user input field */
  label?: string;
  /** declare if this field is required (defaults to `false`) */
  required?: boolean;
  /** regular expression pattern to validate user input client side */
  pattern?: string;
  /** human-readable description of the `type` and/or `pattern`, represents a caption and error, if value doesn't match */
  patternDescription?: string;
  /** the minimum value allowed based on the `type` */
  min?: string | number;
  /** the maximum value allowed based on the `type` */
  max?: string | number;
}

/**
 * Input field type to present to the user
 * @default `text`
 */
export type ActionParameterType =
  | "text"
  | "email"
  | "url"
  | "number"
  | "date"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";

/**
 * note: for ease of reading, this is a simplified type of the actual
 */
interface ActionParameterSelectable extends ActionParameter {
  options: Array<{
    /** displayed UI label of this selectable option */
    label: string;
    /** value of this selectable option */
    value: string;
    /** whether or not this option should be selected by default */
    selected?: boolean;
  }>;
}
