import * as React from 'react';
import * as style from './style.css';
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
import { Election } from 'app/models';
import { IAdminResponse } from "../Home";
import { API_BASE, postData, TI_LOGO } from 'app/utils';

export namespace Vote {
  export interface Props extends RouteComponentProps<void> {
  }

  export interface State {
    selected: string | undefined;
    username: string | undefined;
    election: Election | undefined;
    isUserLoaded: boolean,
  }
}

export interface IRouteParams {
  electionId: string;
  userToken: string;
}

export class Vote extends React.Component<Vote.Props, Vote.State> {
  public state: Vote.State = {
    selected: undefined,
    username: undefined,
    election: undefined,
    isUserLoaded: false,
  }

  constructor(props: Vote.Props, context?: any) {
    super(props, context);
  }

  public componentDidMount() {
      console.warn("Vote component mounted");
      this.loadUser();
      this.loadElection();
  }

  public async loadElection() {
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      const election = await fetch(`${API_BASE}/election/${routeParams.electionId}`).then(r => r.json()) as Election;
      this.setState({ election });
  }

  public async loadUser() {
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      const resp = await fetch(`${API_BASE}/users/${routeParams.userToken}`).then((response) => response.json()) as IAdminResponse;
      this.setState({ username: resp.username, isUserLoaded: true });
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

  private handleVoteSubmit = (candidate: string) => {
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
    const { election } = this.state;

    const request = { candidate, userToken: routeParams.userToken };
    postData(`${API_BASE}/vote/${election!.id}/${election!.round}`, request).then(() => {
      window.location.reload();
    })
  }

  private renderCard = (candidate: string, disable: boolean) => {
    const { selected } = this.state;
    const isSelected = selected !== undefined && selected == candidate;
    let elevation = isSelected ? Elevation.THREE: Elevation.ZERO;
    let interactive = true;
    let onClick = () => {
          this.setState({
            selected: candidate,
          })
        };

    const submitButton = isSelected ? <Button intent={Intent.PRIMARY} text={"Submit Vote"} icon="tick"
      onClick={() => {
        if(confirm(`Do you want to cast your vote for ${candidate}?`)) {
          this.handleVoteSubmit(candidate);
        }
      }}
    /> : undefined;

    if (disable) {
      elevation = Elevation.ZERO;
      interactive = false;
      onClick = () => {};
    }
    return (
      <Card
        interactive={interactive}
        elevation={elevation}
        className={style.card}
        onClick={onClick}
        key={candidate}
      >
        <H3>{candidate}</H3>
        {submitButton}
      </Card>
    );
  }

  private renderCards = (election: Election) => {
    const candidates = election.currentCandidates;
    return candidates.map(c => this.renderCard(c, false));
  }

  private renderCardsClosed = (election: Election) => {
    const candidates = election.currentCandidates;
    return candidates.map(c => this.renderCard(c, true));
  }

  private renderPageBody = () => {
    const { election, username, isUserLoaded } = this.state;
    if (!username && isUserLoaded ) {
      return <div>
        <H3>You are not authenticated!</H3>
        <p>Please confirm that your user token is correct and try again.</p>
      </div>
    } else if (!election || !isUserLoaded) {
      console.log(this.state);
      return <div>Loading...</div>;
    }
    else if (election.state == Election.ElectionState.ACTIVE) {
      return this.renderCards(election);
    } else {
      return this.renderCardsClosed(election);
    }
  }

  render() {
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
    const { election } = this.state;
    const roundText = election && election.round >= 1 ? `(Round ${election.round})` : "";
    const BREADCRUMBS: IBreadcrumbProps[] = [
        { href: `/${routeParams.userToken}`, icon: "layers", text: "All Elections" },
      ];
    if (election) {
      BREADCRUMBS.push(
        { href: `/${routeParams.userToken}/election/${election.id}`, icon: election.icon, text: `${election.position} ${roundText}` }
      );
    }

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
            <img className={style.icon} src={TI_LOGO} />
            <Navbar.Heading>TFI Elections 2020</Navbar.Heading>
            <Navbar.Divider />
            { breadcrumbs }
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Tooltip
              position={Position.BOTTOM_LEFT}
              content={"Signed in as " +this.state.username}
              disabled={!this.state.username}
            >
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
