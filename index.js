const fs = require('fs');

const createAllStateFiles = () => {
    fs.readFile('./db/Estados.json', (err, data) => {
        if (err) {
            console.log('Erro ao ler arquivo Estados.json', err);
            return;
        }

        const estados = JSON.parse(data.toString());
        
        fs.readFile('./db/Cidades.json', (err, cidData) => {
            if (err) {
                console.log('Erro ao ler arquivo Cidades.json', err);
                return;
            }

            const listaCidades = JSON.parse(cidData.toString());
            
            estados.forEach(estado => {
                saveStateFile(estado, listaCidades);
            });
        });
    });
}

const saveStateFile = (estado, listaCidades) => {
    const cidadesPertencentes = listaCidades.filter(cidade => cidade.Estado === estado.ID);

    fs.writeFile(
        `./Estados/${estado.Sigla}.json`, 
        JSON.stringify(cidadesPertencentes, null, 4), 
        (err) => {
            if (err) {
                console.log(`Erro ao gravar arquivo ${estado.Sigla}.json`, err);
                return;
            }
            
            console.log(`Arquivo ${estado.Sigla}.json salvo!`);
        }
    );
}

const countNumberOfCities = (state) => {
    const stateData = fs.readFileSync(`./Estados/${state}.json`);
    
    const cities = JSON.parse(stateData.toString());

    return cities.length;
}

const findStatesWithMoreCities = () => {
    const stateData = fs.readFileSync(`./db/Estados.json`);    
    const states = JSON.parse(stateData.toString());
    const countedStates = states.map(state => ({uf: state.Sigla, count: countNumberOfCities(state.Sigla)}));
    const sortedStates = countedStates.sort((a, b) => {
        if (a.count > b.count) return -1;
        if (a.count < b.count) return 1
        return 0;
    });
    const printStates = sortedStates.splice(0, 5).map(state => `${state.uf} - ${state.count}`);
    console.log(printStates);
}

const findStatesWithLessCities = () => {
    const stateData = fs.readFileSync(`./db/Estados.json`);    
    const states = JSON.parse(stateData.toString());
    const countedStates = states.map(state => ({uf: state.Sigla, count: countNumberOfCities(state.Sigla)}));
    const sortedStates = countedStates.sort((a, b) => {
        if (a.count > b.count) return 1;
        if (a.count < b.count) return -1
        return 0;
    });
    const printStates = sortedStates.splice(0, 5).map(state => `${state.uf} - ${state.count}`);
    console.log(printStates);
}

/******************* EXECUCAO *********************/
// createAllStateFiles();
// console.log(countNumberOfCities('PB'))
// findStatesWithMoreCities();
findStatesWithLessCities();