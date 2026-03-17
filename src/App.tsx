import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = "sigmoid-product" | "sigmoid-diff" | "laplace";

interface SigmoidProductParams {
  a1: number;
  c1: number;
  a2: number;
  c2: number;
}

interface SigmoidDiffParams {
  a1: number;
  c1: number;
  a2: number;
  c2: number;
}

interface LaplaceParams {
  b: number;
  d: number;
}

const sigmoid = (x: number, a: number, c: number): number => {
  return 1 / (1 + Math.exp(-a * (x - c)));
};

const calculateSigmoidProduct = (
  x: number,
  params: SigmoidProductParams
): number => {
  const s1 = sigmoid(x, params.a1, params.c1);
  const s2 = sigmoid(x, params.a2, params.c2);
  return s1 * s2;
};

const calculateSigmoidDiff = (
  x: number,
  params: SigmoidDiffParams
): number => {
  const s1 = sigmoid(x, params.a1, params.c1);
  const s2 = sigmoid(x, params.a2, params.c2);
  return s1 - s2;
};

const calculateLaplace = (x: number, params: LaplaceParams): number => {
  return Math.exp(-Math.abs(x - params.b) / params.d);
};

export function App() {
  const [chartType, setChartType] = useState<ChartType>("sigmoid-diff");
  const [xRange, setXRange] = useState({ min: -20, max: 20 });
  const pointsCount = 1000;
  const [sigmoidProductParams, setSigmoidProductParams] =
    useState<SigmoidProductParams>({
      a1: -6,
      c1: 7,
      a2: 2,
      c2: 2,
    });

  const [sigmoidDiffParams, setSigmoidDiffParams] = useState<SigmoidDiffParams>(
    {
      a1: 6,
      c1: 2,
      a2: 2,
      c2: 7,
    }
  );

  const [laplaceParams, setLaplaceParams] = useState<LaplaceParams>({
    b: 0,
    d: 2,
  });

  const handleReset = () => {
    setXRange({ min: -20, max: 20 });
    setSigmoidProductParams({
      a1: 0,
      c1: 0,
      a2: 0,
      c2: 0,
    });
    setSigmoidDiffParams({
      a1: 0,
      c1: 0,
      a2: 0,
      c2: 0,
    });
    setLaplaceParams({
      b: 0,
      d: 2,
    });
  };

  const chartData = useMemo(() => {
    const labels: number[] = [];
    const data: number[] = [];
    const step = (xRange.max - xRange.min) / pointsCount;

    for (let i = 0; i <= pointsCount; i++) {
      const x = xRange.min + i * step;
      labels.push(Number(x.toFixed(2)));

      let y = 0;
      switch (chartType) {
        case "sigmoid-product":
          y = calculateSigmoidProduct(x, sigmoidProductParams);
          break;
        case "sigmoid-diff":
          y = calculateSigmoidDiff(x, sigmoidDiffParams);
          break;
        case "laplace":
          y = calculateLaplace(x, laplaceParams);
          break;
      }
      data.push(Number(y.toFixed(4)));
    }

    return {
      labels,
      datasets: [
        {
          label: getChartTitle(chartType),
          data,
          borderColor: "rgb(107, 142, 35)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [chartType, xRange, pointsCount, sigmoidProductParams, sigmoidDiffParams, laplaceParams]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: "linear" as const, min: xRange.min, max: xRange.max },
      y: { min: -0.2, max: 1.2 },
    },
  };

  const getParamInputs = () => {
    switch (chartType) {
      case "sigmoid-product":
        return (
          <div>
            <label>a1: </label>
            <input
              type="number"
              step="0.1"
              value={sigmoidProductParams.a1}
              onChange={(e) => setSigmoidProductParams(p => ({ ...p, a1: parseFloat(e.target.value) || 0 }))}
            />
            <label>c1: </label>
            <input
              type="number"
              step="0.5"
              value={sigmoidProductParams.c1}
              onChange={(e) => setSigmoidProductParams(p => ({ ...p, c1: parseFloat(e.target.value) || 0 }))}
            />
            <label>a2: </label>
            <input
              type="number"
              step="0.1"
              value={sigmoidProductParams.a2}
              onChange={(e) => setSigmoidProductParams(p => ({ ...p, a2: parseFloat(e.target.value) || 0 }))}
            />
            <label>c2: </label>
            <input
              type="number"
              step="0.5"
              value={sigmoidProductParams.c2}
              onChange={(e) => setSigmoidProductParams(p => ({ ...p, c2: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        );
      case "sigmoid-diff":
        return (
          <div>
            <label>a1: </label>
            <input
              type="number"
              step="0.1"
              value={sigmoidDiffParams.a1}
              onChange={(e) => setSigmoidDiffParams(p => ({ ...p, a1: parseFloat(e.target.value) || 0 }))}
            />
            <label>c1: </label>
            <input
              type="number"
              step="0.5"
              value={sigmoidDiffParams.c1}
              onChange={(e) => setSigmoidDiffParams(p => ({ ...p, c1: parseFloat(e.target.value) || 0 }))}
            />
            <label>a2: </label>
            <input
              type="number"
              step="0.1"
              value={sigmoidDiffParams.a2}
              onChange={(e) => setSigmoidDiffParams(p => ({ ...p, a2: parseFloat(e.target.value) || 0 }))}
            />
            <label>c2: </label>
            <input
              type="number"
              step="0.5"
              value={sigmoidDiffParams.c2}
              onChange={(e) => setSigmoidDiffParams(p => ({ ...p, c2: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        );
      case "laplace":
        return (
          <div>
            <label>b: </label>
            <input
              type="number"
              step="0.5"
              value={laplaceParams.b}
              onChange={(e) => setLaplaceParams(p => ({ ...p, b: parseFloat(e.target.value) || 0 }))}
            />
            <label>d: </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={laplaceParams.d}
              onChange={(e) => setLaplaceParams(p => ({ ...p, d: Math.max(0.1, parseFloat(e.target.value) || 0.1) }))}
            />
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ height: "400px", width: "100%" }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <select value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)}>
          <option value="sigmoid-product">Добуток сигмоїдних</option>
          <option value="sigmoid-diff">Різниця сигмоїдних</option>
          <option value="laplace">Лапласівська функція</option>
        </select>

        {getParamInputs()}
        <button onClick={handleReset}>Очистити</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <span>Діапазон X:</span>
        <label> Min: </label>
        <input
          type="number"
          value={xRange.min}
          onChange={(e) => setXRange(r => ({ ...r, min: parseFloat(e.target.value) || 0 }))}
        />
        <label> Max: </label>
        <input
          type="number"
          value={xRange.max}
          onChange={(e) => setXRange(r => ({ ...r, max: parseFloat(e.target.value) || 0 }))}
        />
      </div>
    </div>
  );
}

function getChartTitle(type: ChartType): string {
  switch (type) {
    case "sigmoid-product": return "Добуток сигмоїдних функцій";
    case "sigmoid-diff": return "Різниця між сигмоїдними функціями";
    case "laplace": return "Лапласівська функція";
  }
}