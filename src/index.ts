import { startHelpModule } from './Handlers/Help/index'
import { startDiceModule } from './Handlers/Dice/index'
import { startCatModule } from './Handlers/Cat'
import { startDogModule } from './Handlers/Dog'
import { startAdviceModule } from './Handlers/Advice'
import { startFunFactModule } from './Handlers/FunFact'
import { startDefinitionModule } from './Handlers/Definition'
import { startStickerModule } from './Handlers/Sticker'

const helpModule = startHelpModule()

const diceModule = startDiceModule()

const catModule = startCatModule()

const dogModule = startDogModule()

const adviceModule = startAdviceModule()

const funFactModule = startFunFactModule();

const dictionaryModule = startDefinitionModule()

const stickerModule = startStickerModule()

