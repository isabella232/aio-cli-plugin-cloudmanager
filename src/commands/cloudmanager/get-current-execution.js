/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommand = require('../../base-command')
const { getProgramId, getCurrentStep } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../common-flags')

class GetCurrentExecutionCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetCurrentExecutionCommand)

    const programId = await getProgramId(flags)

    let result;

    try {
      result = await this.getCurrentExecution(programId, args.pipelineId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    cli.table([result], {
      pipelineId: {
        header: "Pipeline Id"
      },
      id: {
        header: "Execution Id"
      },
      currentStep: {
        header: "Current Step Action",
        get: item => getCurrentStep(item).action
      },
      currentStepStatus: {
        header: "Current Step Status",
        get: item => getCurrentStep(item).status
      }
    }, {
      printLine: this.log
    })

    return result
  }

  async getCurrentExecution (programId, pipelineId, passphrase = null) {
    return this.withClient(passphrase, client => client.getCurrentExecution(programId, pipelineId))
  }
}

GetCurrentExecutionCommand.description = 'get pipeline execution'

GetCurrentExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

GetCurrentExecutionCommand.args = [
    {name: 'pipelineId', required: true, description: "the pipeline id"}
]


module.exports = GetCurrentExecutionCommand
