import { Component, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Actualiza el estado para que el próximo renderizado muestre el fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aquí puedes realizar acciones adicionales, como enviar errores a un servicio de seguimiento.
    console.error("Error capturado:", error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar la UI de fallback que se muestra cuando ocurre un error.
      return (
        <section className="flex overflow-y-auto flex-col flex-wrap justify-around p-8 h-screen text-red-600">
          <header className="text-3xl text-center">
            <p> Hubo un error en la aplicación. {this.state.error?.message}</p>
          </header>
          <main className="text-center">
            <article>
              <p className="text-2xl">
                Contacte con el administrador del sistema
              </p>
              <p>
                De ser posible envie una imagen con este error, cierre sesion y
                vuelva a iniciar la pagina
              </p>
              <a
                className="cursor-pointer"
                href="mailto:Cgalvan@itglobal.com.gt"
              >
                contactarse a este correo: Cgalvan@itglobal.com.gt
              </a>
            </article>
            <article className="mt-8">
              <p className="text-xl"> Lamentamos los inconvenientes</p>
              <p className="font-bold">
                {" "}
                <a href="/login">Regresar a inicio</a>
              </p>
            </article>
          </main>
          <footer className="text-center">
            <span>Name. {this.state.error?.name}</span>
            <span>Error: {this.state.error?.message}</span>
            <span>Stack. {this.state.error?.stack}</span>
          </footer>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
