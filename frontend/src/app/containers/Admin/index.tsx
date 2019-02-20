import * as React from 'react';
import * as style from './style.css';
import { 
  Button, Collapse, Intent, FormGroup, InputGroup, TextArea, Toaster, Switch
} from "@blueprintjs/core";
import { RouteComponentProps } from 'react-router';
import { postData, API_BASE } from "app/utils";
import { Election } from 'app/models';

export namespace Admin {
  export interface Props extends RouteComponentProps<void> {
    adminToken: string,
    elections: Election[],
  }

  export interface State {
      isEnrollOpen: boolean;
      isNewOpen: boolean;
      isAdministerOpen: boolean;
      newElectionState: INewElectionState;
      enrollState: string;
  }
}

export interface INewElectionState {
  position: string,
  icon: string,
  candidates: string,
}

const adminToaster = Toaster.create();


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
      newElectionState: {
        position: "",
        icon: "",
        candidates: "",
      },
      enrollState: ""
  }

  public componentDidMount() {
      console.warn("Admin component mounted");

  }

  public toggleEnroll = () => this.setState({ isEnrollOpen: !this.state.isEnrollOpen });
  public toggleNew = () => this.setState({ isNewOpen: !this.state.isNewOpen });
  public toggleAdminister = () => this.setState({ isAdministerOpen: !this.state.isAdministerOpen });


  private onEnrollChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const enrollState = this.getElementValue(event);
    this.setState({ enrollState });
  }

  public renderEnrollForm = () => {
      return (
          <div className={style.enrollContainer}>
              <textarea style={{ width: "100%", height: "300px" }} onInput={this.onEnrollChange} />
              <Button intent={Intent.PRIMARY} minimal={true} icon="plus" text="Add Voters"
                onClick={this.handleAddUsers}
              />
              <Button intent={Intent.PRIMARY} minimal={true} icon="circle-arrow-right" text="Send Links" 
                onClick={this.handleSendEmail}
              />
          </div>
      )
  }

  private getElementValue = (event: React.FormEvent) => {
    let element = event.currentTarget as HTMLInputElement;
    return element.value;
  }

  private onPositionChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newElectionState = this.state.newElectionState;
    newElectionState.position = this.getElementValue(event);
    this.setState({ newElectionState });
  }

  private onIconChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newElectionState = this.state.newElectionState;
    newElectionState.icon = this.getElementValue(event);
    this.setState({ newElectionState });
  }

  private onCandidateChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newElectionState = this.state.newElectionState;
    newElectionState.candidates = this.getElementValue(event);
    this.setState({ newElectionState });
  }

  private checknewElectionState = (): boolean => {
    const { newElectionState } = this.state;
    return (newElectionState.position !== "" && newElectionState.icon !== "" && newElectionState.candidates !== "")
  }

  private handleNewElection = () => {
    if (!this.checknewElectionState()) {
      console.warn("Something is incorrect...");
      return;
    }
    const request = { adminToken: this.props.adminToken, ...this.state.newElectionState };
    postData(`${API_BASE}/election/create`, request).then(() => {
      window.location.reload();
    });
  }

  private handleAddUsers = () => {
    const ids = this.state.enrollState.split('\n');
    postData(`${API_BASE}/users/add`, { ids, adminToken: this.props.adminToken }).then((resp) => {
      const { added } = resp;
      adminToaster.show({ message: `Successfully added ${added} users` , intent: "success" });
    }).catch(() => {
      adminToaster.show({ message: `Something went wrong!`, intent: "danger" })
    })
  }

  private handleSendEmail = () => {
    postData(`${API_BASE}/users/email`, { adminToken: this.props.adminToken }).then((resp) => {
      adminToaster.show({ message: "Links sent to voters", intent: "success" })
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

  private onToggleElection = async (election: Election) => {
    // start-round
    if (election.state == Election.ElectionState.CLOSED) {
      postData(`${API_BASE}/election/${election.id}/start-round`).then(() => {
        window.location.reload();
      })
    // stop-round
    } else if (election.state == Election.ElectionState.ACTIVE) {
      postData(`${API_BASE}/election/${election.id}/stop-round`).then(() => {
        window.location.reload();
      })
    } else {
      // do nothing
    }
  }

  private renderElectionControls = () => {
    const { elections } = this.props;
    const inner = elections.map(e => {
      return <Switch 
        label={e.position}
        disabled={e.state == Election.ElectionState.COMPLETED}
        checked={e.state == Election.ElectionState.ACTIVE}
        onChange={() => this.onToggleElection(e)}
        key={e.id}
      />
    });
    return <FormGroup>
      { inner }
    </FormGroup>
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
                {this.renderElectionControls()}
                </Collapse>
          </div>
        </div>
      </div>
    );
  }
}
