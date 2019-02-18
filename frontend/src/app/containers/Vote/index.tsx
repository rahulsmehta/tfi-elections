import * as React from 'react';
import * as style from './style.css';
import { connect } from 'react-redux';
import { 
  Navbar,
  Button,
  Alignment,
  Breadcrumb,
  Breadcrumbs,
  IBreadcrumbProps,
  Icon,
  Classes,
  H3,
  Tooltip,
  Position,
  Card,
  Elevation,
  Intent
} from "@blueprintjs/core";
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { Election, Candidate } from 'app/models';

export namespace Vote {
  export interface Props extends RouteComponentProps<void> {
    election: Election;
    user: string;
  }

  export interface State {
    selected: string | undefined;
  }
}

export interface IRouteParams {
  electionId: string;
  userToken: string;
}

@connect(
  (state: RootState, ownProps: Vote.Props): Partial<Vote.Props> => {
    const { elections, user } = state;

    const { electionId } = (ownProps.match.params as unknown) as IRouteParams;
    const election = elections.filter(e => e.id == electionId)[0];
    return { election, user };
  })
export class Vote extends React.Component<Vote.Props, Vote.State> {
  static defaultProps: Partial<Vote.Props> = {
  };

  public state: Vote.State = {
    selected: undefined
  }

  constructor(props: Vote.Props, context?: any) {
    super(props, context);
    // this.handleClearCompleted = this.handleClearCompleted.bind(this);
    // this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public componentDidMount() {
      console.warn("Vote component mounted");
      console.log(this.props.match);

  }

  public componentWillReceiveProps(nextProps: Vote.Props) {
      console.warn("Vote component re-mounted");
      console.log(nextProps.match);

  }

  private renderCurrentBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb><Icon icon={restProps.icon} /> {text}</Breadcrumb>;
  }

  private renderBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb><Button icon={restProps.icon} className={Classes.MINIMAL} text={text} onClick={() => {
      if (restProps.href) {
        window.location.href = restProps.href;
      }
    }}/></Breadcrumb>;
  }

  // private mapStateToIntent = (state: Election.ElectionState) => {
  //   if (state == Election.ElectionState.ACTIVE) {
  //     return Intent.SUCCESS;
  //   } else if (state == Election.ElectionState.CLOSED) {
  //     return Intent.WARNING;
  //   } else {
  //     return Intent.DANGER;
  //   }
  // }

  // private mapStateToPriority = (state: Election.ElectionState) => {
  //   if (state == Election.ElectionState.ACTIVE) {
  //     return 2;
  //   } else if (state == Election.ElectionState.CLOSED) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // }

  private renderCard = (candidate: Candidate, disable: boolean) => {
    const { selected } = this.state;
    const isSelected = selected !== undefined && selected == candidate.id;
    let elevation = isSelected ? Elevation.THREE: Elevation.ZERO;
    let interactive = true;
    let onClick = () => {
          this.setState({
            selected: candidate.id,
          })
        };

    const submitButton = isSelected ? <Button intent={Intent.PRIMARY} text={"Submit Vote"} icon="tick"
      onClick={() => {
        if(confirm(`Do you want to cast your vote for ${candidate.name}?`)) {
          alert("Voted for " + candidate.name);
        }
      }}
    /> : undefined;

    if (disable) {
      elevation = Elevation.ZERO;
      interactive = false;
      onClick = () => {};
      return (
        <Tooltip content="Voting is currently closed" intent={Intent.WARNING} >
          <Card
            interactive={interactive}
            elevation={elevation}
            className={style.card}
            onClick={onClick}
            key={candidate.id}
          >
            <H3>{candidate.name}</H3>
            {submitButton}
          </Card>
        </Tooltip>
      );
    }
    return (
      <Card
        interactive={interactive}
        elevation={elevation}
        className={style.card}
        onClick={onClick}
        key={candidate.id}
      >
        <H3>{candidate.name}</H3>
        {submitButton}
      </Card>
    );
  }

  private renderCards = () => {
    const candidates = this.props.election.currentCandidates;
    return candidates.map(c => this.renderCard(c, false));
  }

  private renderCardsClosed = () => {
    const candidates = this.props.election.currentCandidates;
    return candidates.map(c => this.renderCard(c, true));
  }

  private renderPageBody = () => {
    const { election }= this.props;
    if (election.state == Election.ElectionState.ACTIVE) {
      return this.renderCards();
    } else if (election.state == Election.ElectionState.CLOSED) {
      return this.renderCardsClosed();
    } else {
      throw new Error("foo");
    }
  }


  render() {
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
    const { election } = this.props;
    const adminButton = true ? (
            <Button className="bp3-minimal" icon="dashboard" text="Admin" /> 
        ) : undefined;

        const BREADCRUMBS: IBreadcrumbProps[] = [
          { href: `/${routeParams.userToken}`, icon: "layers", text: "All Elections" },
          { href: `/${routeParams.userToken}/election/${election.id}`, icon: election.icon, text: election.position }
      ];

    const breadcrumbs = (
          <Breadcrumbs
              currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
              breadcrumbRenderer={this.renderBreadcrumb}
              items={BREADCRUMBS}
          />
      );

    return (
      <div className={style.appContainer}>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <img className={style.icon} src="../../assets/tfi-logo-large.jpg" />
            <Navbar.Heading>TFI Elections Portal</Navbar.Heading>
            <Navbar.Divider />
            { breadcrumbs }
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            {adminButton}
            <Tooltip position={Position.BOTTOM_LEFT} content={"Signed in as " +this.props.user}>
              <Button className="bp3-minimal" icon="person" />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        <div className={style.container} >
          <div className={style.panel}>
              {this.renderPageBody()}
          </div>
        </div>
      </div>
    );
  }
}
