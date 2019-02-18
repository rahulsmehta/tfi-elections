import * as React from 'react';
import * as style from './style.css';
// import { connect } from 'react-redux';
import { 
  Button, Collapse, Intent
} from "@blueprintjs/core";
import { RouteComponentProps } from 'react-router';
// import { RootState } from 'app/reducers';
// import { Election } from 'app/models';

export namespace Admin {
  export interface Props extends RouteComponentProps<void> {}

  export interface State {
      isEnrollOpen: boolean;
      isNewOpen: boolean;
      isAdministerOpen: boolean;
  }
}


// @connect(
//   (state: RootState, ownProps: Admin.Props): Partial<Admin.Props> => {
//     const { elections, user } = state;

//     const { electionId } = (ownProps.match.params as unknown) as IRouteParams;
//     const election = elections.filter(e => e.id == electionId)[0];
//     return { election, user };
//   })
export class Admin extends React.Component<Admin.Props, Admin.State> {

  constructor(props: Admin.Props, context?: any) {
    super(props, context);
    // this.handleClearCompleted = this.handleClearCompleted.bind(this);
    // this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public state: Admin.State = {
      isEnrollOpen: false,
      isNewOpen: false,
      isAdministerOpen: false
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
              <textarea style={{ width: "300px", height: "300px" }} />
              <Button intent={Intent.SUCCESS} minimal={true} icon="plus" text="Add Voters" />
              <Button intent={Intent.SUCCESS} minimal={true} icon="circle-arrow-right" text="Send Links" />
          </div>
      )
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
                    <pre>
                        Dummy text.
                    </pre>
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
