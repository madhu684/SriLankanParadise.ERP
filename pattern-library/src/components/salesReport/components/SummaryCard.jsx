import React from "react";

const SummaryCard = ({
  title,
  value,
  subtitle,
  borderColor = "primary",
  textColor = "primary",
  icon: Icon,
}) => {
  return (
    <div className="col-md-3">
      <div className={`card text-center shadow-sm border-${borderColor} h-100`}>
        <div
          className="card-body d-flex flex-column justify-content-center"
          style={{ minHeight: "130px" }}
        >
          {Icon && (
            <div className="mb-2">
              <Icon size={24} className={`text-${textColor}`} />
            </div>
          )}
          <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
          <h3 className={`card-title text-${textColor} mb-1`}>{value}</h3>
          {subtitle && (
            <small
              className="text-muted"
              style={{ fontSize: "0.7rem", lineHeight: "1.2" }}
            >
              {subtitle}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
