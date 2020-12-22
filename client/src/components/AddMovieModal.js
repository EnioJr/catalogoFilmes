import React, { Component } from "react";
import {
	InputGroup,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
	InputGroupAddon,
	NavLink,
	Container
} from "reactstrap";

import { connect } from "react-redux";
import { addMovie } from "../actions/movieActions";

class AddMovieModal extends Component {
	state = {
		modal: false,
		title: "",
		imagem: "",
		format: "VHS",
		year: 1800,
		stars: [""]
	};

	toggle = () => {
		this.setState({
			modal: !this.state.modal,
			title: "",
			imagem: "",
			format: "VHS",
			year: 1800,
			stars: [""]
		});
	};

	onTitleChange = event => {
		this.setState({
			title: event.target.value
		});
	};

	onImagemChange = event => {
		this.setState({
			imagem: event.target.value
		});
	};

	onYearChange = event => {
		this.setState({
			year: event.target.value
		});
	};

	onFormatChange = event => {
		this.setState({
			format: event.target.value
		});
	};

	onStarChange = (event, index) => {
		const stars = this.state.stars;
		stars[index] = event.target.value;

		this.setState({
			stars: stars
		});
	};

	addStar = () => {
		this.setState({
			stars: [...this.state.stars, ""]
		});
	};

	removeStar = (event, index) => {
		event.preventDefault();

		this.state.stars.splice(index, 1);
		this.setState({
			stars: this.state.stars
		});
	};

	onSubmit = e => {
		e.preventDefault();

		const movie = {
			title: this.state.title,
			year: this.state.year,
			format: this.state.format,
			stars: this.state.stars,
			imagem: this.state.imagem
		};

		this.props
			.addMovie(movie)
			.then(() => {
				this.setState({
					modal: false
				});
			})
			.catch(error => alert(error.response.data));
	};

	render() {
		return (
			<Container>
				<NavLink
					className="navigation-link"
					color="light"
					onClick={this.toggle}
				>
					Adicionar Filme
				</NavLink>

				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>
						Adicionar Filme
					</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Input
									id="title"
									name="title"
									type="text"
									required
									maxLength="100"
									placeholder="Titulo"
									onChange={this.onTitleChange}
								/>
								<Input
									id="year"
									name="year"
									type="number"
									required
									min="1800"
									max="3000"
									placeholder="Ano"
									className="mt-3"
									onChange={this.onYearChange}
								/>
								<Input
									id="imagem"
									name="imagem"
									type="text"
									required
									maxLength="100"
									className="mt-3"
									placeholder="Caminho da Imagem"
									onChange={this.onImagemChange}
								/>
								<Label for="format" className="mt-3">
									Formato
								</Label>
								<Input
									type="select"
									name="format"
									onChange={this.onFormatChange}
								>
									<option>VHS</option>
									<option>DVD</option>
									<option>Blu-Ray</option>
								</Input>
								<Label className="mt-3">Autor(a)</Label>
								{this.state.stars.map((star, index) => {
									return (
										<div key={index} className="mb-3">
											<InputGroup>
												<Input
													type="text"
													value={star}
													onChange={event =>
														this.onStarChange(
															event,
															index
														)
													}
													placeholder="Nome & Sobrenome"
													required
													maxLength="100"
												/>
												<InputGroupAddon addonType="append">
													<Button
														color="dark"
														className="fa fa-trash"
														onClick={event =>
															this.removeStar(
																event,
																index
															)
														}
													/>
												</InputGroupAddon>
											</InputGroup>
										</div>
									);
								})}
								<Button
									color="dark"
									outline
									block
									onClick={this.addStar}
								>
									Adicionar Autor(a)
								</Button>
								<Button
									color="dark"
									block
									style={{ marginTop: "2rem" }}
									type="submit"
								>
									Adicionar
								</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</Container>
		);
	}
}

const mapStateToProps = state => ({
	movie: state.movie
});

export default connect(
	mapStateToProps,
	{ addMovie }
)(AddMovieModal);
