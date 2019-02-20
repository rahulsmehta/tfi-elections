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
import { IAdminResponse } from "../Home";

export namespace Vote {
  export interface Props extends RouteComponentProps<void> {
    election: Election;
  }

  export interface State {
    selected: string | undefined;
    username: string | undefined;
  }
}

export interface IRouteParams {
  electionId: string;
  userToken: string;
}

@connect(
  (state: RootState, ownProps: Vote.Props): Partial<Vote.Props> => {
    const { elections } = state;

    const { electionId } = (ownProps.match.params as unknown) as IRouteParams;
    const election = elections.filter(e => e.id == electionId)[0];
    return { election };
  })
export class Vote extends React.Component<Vote.Props, Vote.State> {
  static defaultProps: Partial<Vote.Props> = {
  };

  public state: Vote.State = {
    selected: undefined,
    username: undefined
  }

  constructor(props: Vote.Props, context?: any) {
    super(props, context);
    // this.handleClearCompleted = this.handleClearCompleted.bind(this);
    // this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public componentDidMount() {
      console.warn("Vote component mounted");
      this.loadUser();
  }

  // public componentWillReceiveProps(nextProps: Vote.Props) {
  //     console.warn("Vote component re-mounted");
  //     console.log(nextProps.match);

  // }

  public async loadUser() {
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      const resp = await fetch(`http://localhost:3001/api/users/${routeParams.userToken}`).then((response) => response.json()) as IAdminResponse;
      console.log(resp);
      if (resp.username === undefined) {
        window.location.href = 'http://www.google.com';
      }
      this.setState({ username: resp.username });
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
    const BREADCRUMBS: IBreadcrumbProps[] = [
        { href: `/${routeParams.userToken}`, icon: "layers", text: "All Elections" },
        { href: `/${routeParams.userToken}/election/${election.id}`, icon: election.icon, text: `${election.position} (Round ${election.round + 1})` }
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
            <Tooltip position={Position.BOTTOM_LEFT} content={"Signed in as " +this.state.username}>
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
