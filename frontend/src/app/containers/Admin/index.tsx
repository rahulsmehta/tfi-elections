import * as React from 'react';
import * as style from './style.css';
// import { connect } from 'react-redux';
import { 
  Button, Collapse, Intent, FormGroup, InputGroup, TextArea
} from "@blueprintjs/core";
import { RouteComponentProps } from 'react-router';
// import { RootState } from 'app/reducers';
// import { Election } from 'app/models';

export namespace Admin {
  export interface Props extends RouteComponentProps<void> {
    adminToken: string,
  }

  export interface State {
      isEnrollOpen: boolean;
      isNewOpen: boolean;
      isAdministerOpen: boolean;
      enrollState: IEnrollState;
  }
}

export interface IEnrollState {
  position: string,
  icon: string,
  candidates: string,
}


export class Admin extends React.Component<Admin.Props, Admin.State> {

  constructor(props: Admin.Props, context?: any) {
    super(props, context);
    // this.handleClearCompleted = this.handleClearCompleted.bind(this);
    // this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
  }

  public state: Admin.State = {
      isEnrollOpen: false,
      isNewOpen: false,
      isAdministerOpen: false,
      enrollState: {
        position: "",
        icon: "",
        candidates: "",
      }
  }

  public componentDidMount() {
      console.warn("Admin component mounted");
    //   console.log(this.props.match);

  }

  public toggleEnroll = () => this.setState({ isEnrollOpen: !this.state.isEnrollOpen });
  public toggleNew = () => this.setState({ isNewOpen: !this.state.isNewOpen });
  public toggleAdminister = () => this.setState({ isAdministerOpen: !this.state.isAdministerOpen });


  public renderEnrollForm = () => {
      return (
          <div className={style.enrollContainer}>
              <textarea style={{ width: "100%", height: "300px" }} />
              <Button intent={Intent.PRIMARY} minimal={true} icon="plus" text="Add Voters" />
              <Button intent={Intent.PRIMARY} minimal={true} icon="circle-arrow-right" text="Send Links" />
          </div>
      )
  }

  private getElementValue = (event: React.FormEvent) => {
    let element = event.currentTarget as HTMLInputElement;
    return element.value;
  }

  private onPositionChange = (event: React.FormEvent<HTMLInputElement>) => {
    const enrollState = this.state.enrollState;
    enrollState.position = this.getElementValue(event);
    this.setState({ enrollState });
  }

  private onIconChange = (event: React.FormEvent<HTMLInputElement>) => {
    const enrollState = this.state.enrollState;
    enrollState.icon = this.getElementValue(event);
    this.setState({ enrollState });
  }

  private onCandidateChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const enrollState = this.state.enrollState;
    enrollState.candidates = this.getElementValue(event);
    this.setState({ enrollState });
  }

  private checkEnrollState = (): boolean => {
    const { enrollState } = this.state;
    return (enrollState.position !== "" && enrollState.icon !== "" && enrollState.candidates !== "")
  }

  private postData(url = ``, data = {}) {
    // Default options are marked with *
      return fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/json",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(response => response.json()); // parses response to JSON
  }

  private handleNewElection = () => {
    if (!this.checkEnrollState()) {
      console.warn("Something is incorrect...");
    }
    this.postData(`http://localhost:3001/api/election/create`, this.state.enrollState).then(() => {
      window.location.reload();
    });
  }


  public renderNewElectionForm = () => {
    return (
        <div className={style.enrollContainer}>
            <FormGroup label={"Position"} >
                <InputGroup
                  id="new-election-position"
                  placeholder={"President"}
                  onInput={this.onPositionChange}
                />
            </FormGroup>
            <FormGroup label={"Icon"} >
                <InputGroup id="new-election-icon" placeholder={"globe-network"} onInput={this.onIconChange} />
            </FormGroup>
            <FormGroup label={"Candidates"}>
                <TextArea
                    intent={Intent.PRIMARY}
                    style={{ width: "100%", height: "150px" }}
                    placeholder={"Enter one candidate per line"}
                    onInput={this.onCandidateChange}
                />
            </FormGroup>
            <Button intent={Intent.PRIMARY} minimal={true} icon="add" text="Add Election" onClick={this.handleNewElection} />
        </div>
    );
  }

  render() {
    return (
      <div className={style.appContainer}>
        <div className={style.container} >
          <div className={style.panel}>
              <Button 
                text="Enroll Voters"
                onClick={this.toggleEnroll}
                icon={this.state.isEnrollOpen ? "caret-down" : "caret-right"}
                large={true} 
                minimal={true}
              />
              <Collapse isOpen={this.state.isEnrollOpen}>
                {this.renderEnrollForm()}
                </Collapse>
              <Button
                text="New Election"
                onClick={this.toggleNew}
                icon={this.state.isNewOpen? "caret-down" : "caret-right"}
                minimal={true}
                large={true}
               />
              <Collapse isOpen={this.state.isNewOpen}>
                    {this.renderNewElectionForm()}
                </Collapse>
              <Button
                text="Administer Election"
                onClick={this.toggleAdminister}
                icon={this.state.isAdministerOpen ? "caret-down" : "caret-right"}
                large={true}
                minimal={true}
               />
              <Collapse isOpen={this.state.isAdministerOpen}>
                    <pre>
                        Dummy text.
                    </pre>
                </Collapse>
          </div>
        </div>
      </div>
    );
  }
}
