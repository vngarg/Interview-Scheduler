import React from "react";
import { Form, InputGroup, FormControl } from "react-bootstrap";

const InputField = (props) => {
  return (
    <Form.Group>
      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.text}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.onChange}
          value={props.value ? props.value : null}
        />
      </InputGroup>
    </Form.Group>
  );
};

export default InputField;
